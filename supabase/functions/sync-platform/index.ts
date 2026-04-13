import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  // LeetCode GraphQL public endpoint
  const query = `{
    matchedUser(username: "${handle}") {
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
      profile {
        ranking
        reputation
      }
      contestBadge { name }
    }
    userContestRanking(username: "${handle}") {
      rating
      attendedContestsCount
      globalRanking
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
    easy_solved: easy,
    medium_solved: medium,
    hard_solved: hard,
    contribution_score: json.data.matchedUser.profile?.reputation || 0,
    raw_payload: json.data,
  };
}

// ─── GeeksforGeeks Adapter ───
async function fetchGFG(handle: string): Promise<NormalizedStats> {
  const res = await fetch(`https://geeks-for-geeks-stats-api.vercel.app/?userName=${handle}`);
  if (!res.ok) throw new Error(`GFG API error: ${res.status}`);
  const json = await res.json();

  if (json.error) throw new Error(`GFG user '${handle}' not found`);

  const totalSolved = parseInt(json.totalProblemsSolved || "0", 10);
  const easy = parseInt(json.Easy || json.school || "0", 10);
  const medium = parseInt(json.Medium || json.basic || "0", 10);
  const hard = parseInt(json.Hard || "0", 10);

  return {
    problems_solved: totalSolved || (easy + medium + hard),
    contest_rating: parseInt(json.contestRating || "0", 10),
    contests_attended: parseInt(json.contestsAttended || "0", 10),
    easy_solved: easy,
    medium_solved: medium,
    hard_solved: hard,
    contribution_score: parseInt(json.codingScore || "0", 10),
    raw_payload: json,
  };
}

// ─── HackerRank Adapter ───
async function fetchHackerRank(handle: string): Promise<NormalizedStats> {
  // HackerRank badges endpoint (public)
  const res = await fetch(`https://www.hackerrank.com/rest/hackers/${handle}/badges`);
  if (!res.ok) throw new Error(`HackerRank API error: ${res.status}`);
  const badges = await res.json();

  // Submissions summary
  const subRes = await fetch(`https://www.hackerrank.com/rest/hackers/${handle}/submission_histories`);
  const submissions = subRes.ok ? await subRes.json() : {};

  // Count total submissions as proxy for problems solved
  let totalSolved = 0;
  for (const key in submissions) {
    totalSolved += parseInt(submissions[key] || "0", 10);
  }

  const badgeCount = Array.isArray(badges.models) ? badges.models.length : 0;

  return {
    problems_solved: totalSolved,
    contest_rating: 0,
    contests_attended: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    contribution_score: badgeCount * 50,
    raw_payload: { badges: badges.models || [], submissions },
  };
}

const adapters: Record<string, (handle: string) => Promise<NormalizedStats>> = {
  leetcode: fetchLeetCode,
  gfg: fetchGFG,
  hackerrank: fetchHackerRank,
};

// ─── Score computation ───
function computeScore(profiles: NormalizedStats[]): number {
  let score = 0;
  for (const p of profiles) {
    score += p.problems_solved * 2;
    score += p.easy_solved * 1;
    score += p.medium_solved * 3;
    score += p.hard_solved * 5;
    score += p.contest_rating * 0.5;
    score += p.contests_attended * 10;
    score += p.contribution_score * 0.1;
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const targetPlatform = body.platform; // optional: sync specific platform

    // Cooldown check: no sync within 5 minutes
    const { data: recentJob } = await supabase
      .from("sync_jobs")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "success")
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    if (recentJob?.completed_at) {
      const diff = Date.now() - new Date(recentJob.completed_at).getTime();
      if (diff < 5 * 60 * 1000) {
        return new Response(JSON.stringify({
          error: "Cooldown active",
          next_sync_at: new Date(new Date(recentJob.completed_at).getTime() + 5 * 60 * 1000).toISOString(),
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Create sync job
    const { data: syncJob } = await supabase
      .from("sync_jobs")
      .insert({ user_id: user.id, platform: targetPlatform || "all", status: "running", started_at: new Date().toISOString() })
      .select()
      .single();

    // Get user's platform profiles
    let profilesQuery = supabase.from("platform_profiles").select("*").eq("user_id", user.id);
    if (targetPlatform) profilesQuery = profilesQuery.eq("platform", targetPlatform);
    const { data: platformProfiles } = await profilesQuery;

    if (!platformProfiles || platformProfiles.length === 0) {
      await supabase.from("sync_jobs").update({ status: "failed", error_message: "No platforms linked", completed_at: new Date().toISOString() }).eq("id", syncJob!.id);
      return new Response(JSON.stringify({ error: "No platforms linked" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Record<string, { success: boolean; error?: string }> = {};

    for (const pp of platformProfiles) {
      const adapter = adapters[pp.platform];
      if (!adapter) {
        results[pp.platform] = { success: false, error: "Unknown platform" };
        continue;
      }

      try {
        await supabase.from("platform_profiles").update({ sync_status: "syncing" }).eq("id", pp.id);

        const stats = await adapter(pp.handle);

        // Update platform profile
        await supabase.from("platform_profiles").update({
          ...stats,
          sync_status: "success",
          sync_error: null,
          last_synced_at: new Date().toISOString(),
          verified: true,
        }).eq("id", pp.id);

        // Save snapshot
        await supabase.from("platform_snapshots").insert({
          user_id: user.id,
          platform: pp.platform,
          problems_solved: stats.problems_solved,
          contest_rating: stats.contest_rating,
          contests_attended: stats.contests_attended,
          easy_solved: stats.easy_solved,
          medium_solved: stats.medium_solved,
          hard_solved: stats.hard_solved,
          raw_payload: stats.raw_payload,
        });

        results[pp.platform] = { success: true };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Unknown error";
        await supabase.from("platform_profiles").update({
          sync_status: "failed",
          sync_error: errMsg,
        }).eq("id", pp.id);
        results[pp.platform] = { success: false, error: errMsg };
      }
    }

    // Recompute score
    const { data: allProfiles } = await supabase
      .from("platform_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("sync_status", "success");

    const normalizedAll: NormalizedStats[] = (allProfiles || []).map((p) => ({
      problems_solved: p.problems_solved || 0,
      contest_rating: p.contest_rating || 0,
      contests_attended: p.contests_attended || 0,
      easy_solved: p.easy_solved || 0,
      medium_solved: p.medium_solved || 0,
      hard_solved: p.hard_solved || 0,
      contribution_score: p.contribution_score || 0,
      raw_payload: p.raw_payload as Record<string, unknown> || {},
    }));

    const weightedScore = computeScore(normalizedAll);
    const totalSolved = normalizedAll.reduce((s, p) => s + p.problems_solved, 0);
    const totalRating = normalizedAll.reduce((s, p) => s + p.contest_rating, 0);
    const totalContests = normalizedAll.reduce((s, p) => s + p.contests_attended, 0);

    // Upsert user score
    await supabase.from("user_scores").upsert({
      user_id: user.id,
      total_problems_solved: totalSolved,
      total_contest_rating: totalRating,
      total_contests_attended: totalContests,
      weighted_score: weightedScore,
      platforms_linked: allProfiles?.length || 0,
      last_computed_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    // Recompute global ranks for ALL users
    const { data: allScores } = await supabase
      .from("user_scores")
      .select("user_id, weighted_score")
      .order("weighted_score", { ascending: false });

    if (allScores) {
      for (let i = 0; i < allScores.length; i++) {
        const prevRank = await supabase
          .from("user_scores")
          .select("global_rank")
          .eq("user_id", allScores[i].user_id)
          .single();

        const oldRank = prevRank.data?.global_rank || (i + 1);
        const newRank = i + 1;

        await supabase.from("user_scores").update({
          global_rank: newRank,
          rank_change: oldRank - newRank,
        }).eq("user_id", allScores[i].user_id);
      }
    }

    // Complete sync job
    await supabase.from("sync_jobs").update({
      status: "success",
      completed_at: new Date().toISOString(),
    }).eq("id", syncJob!.id);

    return new Response(JSON.stringify({ success: true, results, weighted_score: weightedScore }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("Sync error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
