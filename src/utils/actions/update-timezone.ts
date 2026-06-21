'use server';

import setUserTimezone from "@/app/queries/server/set-user-timezone";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateTimezone(timezone: string): Promise<void> { 
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Unauthorized action: ", authError);
    return;
  }

  await setUserTimezone(user.id, timezone);
}