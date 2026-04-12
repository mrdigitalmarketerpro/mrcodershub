import { supabase } from "@/integrations/supabase/client";

// ─── Platform Profiles ───
export async function getUserPlatformProfiles(userId: string) {
  const { data, error } = await supabase
    .from("platform_profiles")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
}

export async function linkPlatform(userId: string, platform: string, handle: string) {
  const { data, error } = await supabase
    .from("platform_profiles")
    .upsert({ user_id: userId, platform, handle }, { onConflict: "user_id,platform" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unlinkPlatform(userId: string, platform: string) {
  const { error } = await supabase
    .from("platform_profiles")
    .delete()
    .eq("user_id", userId)
    .eq("platform", platform);
  if (error) throw error;
}

// ─── Sync ───
export async function triggerSync(platform?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await supabase.functions.invoke("sync-platform", {
    body: { platform },
  });

  if (res.error) throw new Error(res.error.message || "Sync failed");
  return res.data;
}

// ─── Scores & Leaderboard ───
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("user_scores")
    .select(`
      *,
      profiles!user_scores_user_id_fkey (
        display_name,
        username,
        avatar_url,
        college
      )
    `)
    .order("weighted_score", { ascending: false });

  // If the join fails (no FK), fall back to manual join
  if (error) {
    const { data: scores } = await supabase
      .from("user_scores")
      .select("*")
      .order("weighted_score", { ascending: false });

    if (!scores) return [];

    const userIds = scores.map(s => s.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, avatar_url, college")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    return scores.map(s => ({
      ...s,
      profile: profileMap.get(s.user_id) || null,
    }));
  }

  return (data || []).map(d => ({
    ...d,
    profile: (d as any).profiles || null,
  }));
}

export async function getUserScore(userId: string) {
  const { data } = await supabase
    .from("user_scores")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

// ─── Snapshots for charts ───
export async function getUserSnapshots(userId: string) {
  const { data } = await supabase
    .from("platform_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("captured_at", { ascending: true });
  return data || [];
}

// ─── Profile ───
export async function updateProfile(userId: string, updates: {
  display_name?: string | null;
  username?: string | null;
  college?: string | null;
  leetcode_handle?: string | null;
  gfg_handle?: string | null;
  hackerrank_handle?: string | null;
  github_username?: string | null;
  onboarded?: boolean;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
