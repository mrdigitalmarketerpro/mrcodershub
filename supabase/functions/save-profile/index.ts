import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Verify user
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { display_name, college, leetcode_handle, gfg_handle, hackerrank_handle, onboarded } = body;

    if (!display_name || typeof display_name !== "string" || display_name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "display_name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Upsert profile
    const updates: Record<string, unknown> = {
      display_name: display_name.trim(),
      college: college?.trim() || null,
      leetcode_handle: leetcode_handle?.trim() || null,
      gfg_handle: gfg_handle?.trim() || null,
      hackerrank_handle: hackerrank_handle?.trim() || null,
    };
    if (typeof onboarded === "boolean") updates.onboarded = onboarded;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upsert platform_profiles for each handle
    const platforms = [
      { platform: "leetcode", handle: leetcode_handle?.trim() },
      { platform: "gfg", handle: gfg_handle?.trim() },
      { platform: "hackerrank", handle: hackerrank_handle?.trim() },
    ];

    for (const p of platforms) {
      if (p.handle) {
        await supabase.from("platform_profiles").upsert(
          { user_id: user.id, platform: p.platform, handle: p.handle },
          { onConflict: "user_id,platform" }
        );
      } else {
        // Remove if handle cleared
        await supabase
          .from("platform_profiles")
          .delete()
          .eq("user_id", user.id)
          .eq("platform", p.platform);
      }
    }

    return new Response(JSON.stringify({ success: true, profile: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
