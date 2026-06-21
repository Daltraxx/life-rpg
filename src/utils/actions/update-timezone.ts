"use server";

import setUserTimezone from "@/app/queries/server/set-user-timezone";
import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Updates the timezone for the authenticated user in the database.
 * @param timezone - The timezone string to set for the user
 * @throws Will return early if user is not authenticated
 */
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

  // console.log("Updating timezone for user:", user.id, "to", timezone);
  await setUserTimezone(user.id, timezone);
}
