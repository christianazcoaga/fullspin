import { createClient } from "@/lib/supabase/client";

export async function handleAuthError(error: any) {
  if (error?.message?.includes("Invalid Refresh Token")) {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }
} 