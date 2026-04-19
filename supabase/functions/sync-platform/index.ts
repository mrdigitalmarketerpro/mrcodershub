import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface NormalizedStats {
  problems_solved: number;
  contest_rating: number;
  contests_attended: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  contribution_score: number;
  raw_payload: Record<string, unknown>;
}

// ─── LeetCode Adapter ───
async function fetchLeetCode(handle: string): Promise<NormalizedStats> {
  const query = `{
    matchedUser(username: "${handle}") {
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      profile { ranking reputation }
    }
    userContestRanking(username: "${handle}") {
      rating attendedContestsCount globalRanking
    }
  }`;

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
  const json = await res.json();
  if (!json.data?.matchedUser) throw new Error(`LeetCode user '${handle}' not found`);

  const stats = json.data.matchedUser.submitStatsGlobal.acSubmissionNum;
  const contest = json.data.userContestRanking;
  const easy = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;

  return {
    problems_solved: easy + medium + hard,
    contest_rating: Math.round(contest?.rating || 0),
    contests_attended: contest?.attendedContestsCount || 0,
    easy_solved: easy, medium_solved: medium, hard_solved: hard,
    contribution_score: json.data.matchedUser.profile?.reputation || 0,
    raw_payload: json.data,
  };
}

// ─── GeeksforGeeks Adapter (official authapi endpoint) ───
async function fetchGFG(handle: string): Promise<NormalizedStats> {
  const url = `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${encodeURIComponent(handle)}&article_count=0`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MRCodersHub/1.0)",
      "Accept": "application/json",
    },
  });
  if (!res.ok) throw new Error(`GFG API error: ${res.status}`);
  const json = await res.json().catch(() => null);
  if (!json?.data || !json.data.name) throw new Error(`GFG user '${handle}' not found`);

  const d = json.data;
  const totalSolved = parseInt(String(d.total_problems_solved ?? 0), 10);
  const score = parseInt(String(d.score ?? 0), 10);

  return {
    problems_solved: totalSolved,
    contest_rating: 0,
    contests_attended: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    contribution_score: score,
    raw_payload: d,
  };
}

// ─── HackerRank Adapter (public profile + scores endpoints) ───
async function fetchHackerRank(handle: string): Promise<NormalizedStats> {
  const headers = { "User-Agent": "Mozilla/5.0 (compatible; MRCodersHub/1.0)" };

  const profRes = await fetch(
    `https://www.hackerrank.com/rest/contests/master/hackers/${encodeURIComponent(handle)}/profile`,
    { headers },
  );
  if (!profRes.ok) throw new Error(`HackerRank API error: ${profRes.status}`);
  const profJson = await profRes.json().catch(() => null);
  if (!profJson?.model?.username) throw new Error(`HackerRank user '${handle}' not found`);

  const scoresRes = await fetch(
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(handle)}/scores_elo`,
    { headers },
  );
  const scores = scoresRes.ok ? await scoresRes.json().catch(() => []) : [];

  let totalScore = 0;
  let medals = 0;
  if (Array.isArray(scores)) {
    for (const t of scores) {
      totalScore += Number(t?.practice?.score) || 0;
      const m = t?.contest?.medals;
      if (m) medals += (m.gold || 0) + (m.silver || 0) + (m.bronze || 0);
    }
  }

  const badgesRes = await fetch(
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(handle)}/badges`,
    { headers },
  );
  const badges = badgesRes.ok ? await badgesRes.json().catch(() => ({ models: [] })) : { models: [] };
  const solvedFromBadges = Array.isArray(badges.models)
    ? badges.models.reduce((s: number, b: any) => s + (Number(b?.solved) || 0), 0)
    : 0;

  return {
    problems_solved: solvedFromBadges,
    contest_rating: Math.round(totalScore),
    contests_attended: medals,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    contribution_score: Array.isArray(badges.models) ? badges.models.length * 50 : 0,
    raw_payload: { profile: profJson.model, scores, badges: badges.models || [] },
  };
}

const adapters: Record<string, (handle: string) => Promise<NormalizedStats>> = {
  leetcode: fetchLeetCode,
  gfg: fetchGFG,
  hackerrank: fetchHackerRank,
};

function computeScore(profiles: NormalizedStats[]): number {
  let score = 0;
  for (const p of profiles) {
    score += p.problems_solved * 2 + p.easy_solved * 1 + p.medium_solved * 3 + p.hard_solved * 5;
    score += p.contest_rating * 0.5 + p.contests_attended * 10 + p.contribution_score * 0.1;
  }
  return Math.round(score * 100) / 100;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("sync-platform: No Authorization header");
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();

    if (authError || !user) {
      console.error("sync-platform: Auth failed", authError?.message);
      return jsonResponse({ error: "Invalid or expired token" }, 401);
    }

    console.log("sync-platform: Authenticated user", user.id);

    const supabase = createClient(supabaseUrl, serviceKey);
    const body = await req.json().catch(() => ({}));
    const targetPlatform = body.platform;

    // Cooldown check
    const { data: recentJob } = await supabase
      .from("sync_jobs")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("status", "success")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (recentJob?.completed_at) {
      const diff = Date.now() - new Date(recentJob.completed_at).getTime();
      if (diff < 5 * 60 * 1000) {
        return jsonResponse({ error: "Cooldown active", next_sync_at: new Date(new Date(recentJob.completed_at).getTime() + 300000).toISOString() }, 429);
      }
    }

    // Create sync job
    const { data: syncJob } = await supabase
      .from("sync_jobs")
      .insert({ user_id: user.id, platform: targetPlatform || "all", status: "running", started_at: new Date().toISOString() })
      .select("id")
      .single();

    // Get linked platforms
    let q = supabase.from("platform_profiles").select("*").eq("user_id", user.id);
    if (targetPlatform) q = q.eq("platform", targetPlatform);
    const { data: platformProfiles } = await q;

    if (!platformProfiles || platformProfiles.length === 0) {
      if (syncJob) await supabase.from("sync_jobs").update({ status: "failed", error_message: "No platforms linked", completed_at: new Date().toISOString() }).eq("id", syncJob.id);
      return jsonResponse({ error: "No platforms linked. Add handles in Settings first." }, 400);
    }

    const results: Record<string, { success: boolean; error?: string }> = {};

    for (const pp of platformProfiles) {
      const adapter = adapters[pp.platform];
      if (!adapter) { results[pp.platform] = { success: false, error: "Unknown platform" }; continue; }

      try {
        await supabase.from("platform_profiles").update({ sync_status: "syncing" }).eq("id", pp.id);
        const stats = await adapter(pp.handle);

        await supabase.from("platform_profiles").update({
          ...stats, sync_status: "success", sync_error: null,
          last_synced_at: new Date().toISOString(), verified: true,
        }).eq("id", pp.id);

        await supabase.from("platform_snapshots").insert({
          user_id: user.id, platform: pp.platform,
          problems_solved: stats.problems_solved, contest_rating: stats.contest_rating,
          contests_attended: stats.contests_attended, easy_solved: stats.easy_solved,
          medium_solved: stats.medium_solved, hard_solved: stats.hard_solved,
          raw_payload: stats.raw_payload,
        });

        results[pp.platform] = { success: true };
        console.log(`sync-platform: ${pp.platform} synced for ${pp.handle}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Unknown error";
        await supabase.from("platform_profiles").update({ sync_status: "failed", sync_error: errMsg }).eq("id", pp.id);
        results[pp.platform] = { success: false, error: errMsg };
        console.error(`sync-platform: ${pp.platform} failed`, errMsg);
      }
    }

    // Recompute score
    const { data: allProfiles } = await supabase
      .from("platform_profiles").select("*").eq("user_id", user.id).eq("sync_status", "success");

    const normalized: NormalizedStats[] = (allProfiles || []).map((p) => ({
      problems_solved: p.problems_solved || 0, contest_rating: p.contest_rating || 0,
      contests_attended: p.contests_attended || 0, easy_solved: p.easy_solved || 0,
      medium_solved: p.medium_solved || 0, hard_solved: p.hard_solved || 0,
      contribution_score: p.contribution_score || 0,
      raw_payload: (p.raw_payload as Record<string, unknown>) || {},
    }));

    const weightedScore = computeScore(normalized);
    const totalSolved = normalized.reduce((s, p) => s + p.problems_solved, 0);
    const totalRating = normalized.reduce((s, p) => s + p.contest_rating, 0);
    const totalContests = normalized.reduce((s, p) => s + p.contests_attended, 0);

    await supabase.from("user_scores").upsert({
      user_id: user.id, total_problems_solved: totalSolved, total_contest_rating: totalRating,
      total_contests_attended: totalContests, weighted_score: weightedScore,
      platforms_linked: allProfiles?.length || 0, last_computed_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    // Recompute global ranks
    const { data: allScores } = await supabase
      .from("user_scores").select("user_id, weighted_score, global_rank")
      .order("weighted_score", { ascending: false });

    if (allScores) {
      for (let i = 0; i < allScores.length; i++) {
        const newRank = i + 1;
        const oldRank = allScores[i].global_rank || newRank;
        await supabase.from("user_scores").update({
          global_rank: newRank, rank_change: oldRank - newRank,
        }).eq("user_id", allScores[i].user_id);
      }
    }

    if (syncJob) await supabase.from("sync_jobs").update({ status: "success", completed_at: new Date().toISOString() }).eq("id", syncJob.id);

    console.log("sync-platform: Complete", results);
    return jsonResponse({ success: true, results, weighted_score: weightedScore });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("sync-platform: Unhandled error", msg);
    return jsonResponse({ error: msg }, 500);
  }
});
