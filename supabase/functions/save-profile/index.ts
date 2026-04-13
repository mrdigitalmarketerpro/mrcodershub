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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("save-profile: No Authorization header");
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // 2. Verify user token
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser();

    if (authError || !user) {
      console.error("save-profile: Auth failed", authError?.message);
      return jsonResponse({ error: "Invalid or expired token" }, 401);
    }

    console.log("save-profile: Authenticated user", user.id);

    // 3. Parse body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const {
      display_name,
      college,
      leetcode_handle,
      gfg_handle,
      hackerrank_handle,
      onboarded,
    } = body as Record<string, string | boolean | null | undefined>;

    // 4. Validate
    if (
      display_name !== undefined &&
      (typeof display_name !== "string" || display_name.trim().length === 0)
    ) {
      return jsonResponse({ error: "display_name must be a non-empty string" }, 400);
    }

    // 5. Service-role client for mutations
    const supabase = createClient(supabaseUrl, serviceKey);

    // 6. Upsert profile (handles both insert and update)
    const updates: Record<string, unknown> = {
      user_id: user.id,
    };
    if (display_name !== undefined) updates.display_name = (display_name as string).trim();
    if (college !== undefined) updates.college = typeof college === "string" ? college.trim() || null : null;
    if (leetcode_handle !== undefined)
      updates.leetcode_handle = typeof leetcode_handle === "string" ? leetcode_handle.trim() || null : null;
    if (gfg_handle !== undefined)
      updates.gfg_handle = typeof gfg_handle === "string" ? gfg_handle.trim() || null : null;
    if (hackerrank_handle !== undefined)
      updates.hackerrank_handle = typeof hackerrank_handle === "string" ? hackerrank_handle.trim() || null : null;
    if (typeof onboarded === "boolean") updates.onboarded = onboarded;

    console.log("save-profile: Upserting profile for", user.id, updates);

    const { data, error } = await supabase
      .from("profiles")
      .upsert(updates, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("save-profile: DB upsert error", error.message, error.details);
      return jsonResponse({ error: "Failed to save profile: " + error.message }, 500);
    }

    console.log("save-profile: Profile saved successfully");

    // 7. Upsert platform_profiles for each handle
    const platforms = [
      { platform: "leetcode", handle: typeof leetcode_handle === "string" ? leetcode_handle.trim() : "" },
      { platform: "gfg", handle: typeof gfg_handle === "string" ? gfg_handle.trim() : "" },
      { platform: "hackerrank", handle: typeof hackerrank_handle === "string" ? hackerrank_handle.trim() : "" },
    ];

    for (const p of platforms) {
      if (p.handle) {
        const { error: ppErr } = await supabase.from("platform_profiles").upsert(
          { user_id: user.id, platform: p.platform, handle: p.handle },
          { onConflict: "user_id,platform" }
        );
        if (ppErr) console.error(`save-profile: platform_profiles upsert error (${p.platform})`, ppErr.message);
      } else {
        // Remove if handle cleared
        await supabase
          .from("platform_profiles")
          .delete()
          .eq("user_id", user.id)
          .eq("platform", p.platform);
      }
    }

    return jsonResponse({ success: true, profile: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("save-profile: Unhandled error", msg);
    return jsonResponse({ error: msg }, 500);
  }
});
