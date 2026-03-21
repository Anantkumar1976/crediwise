import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export function getServiceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getAuthEmailForUser(userId: string): Promise<string | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) {
    console.error("getAuthEmailForUser:", error?.message ?? "no email");
    return null;
  }
  return data.user.email;
}
