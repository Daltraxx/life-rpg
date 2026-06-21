"use server";

import setUserTimezone from "@/app/queries/server/set-user-timezone";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { COOKIES } from "@/utils/constants/server-cookies";
import setUserTimezoneCookie from "@/utils/cookies/set-user-timezone-cookie";
import { isValidTimezone } from "../validations/timezone";

/**
 * Updates the timezone for the authenticated user in the database if it has changed.
 * Also updates the user's timezone cookie if it has changed.
 *
 * @param timezone - The timezone string to set for the user
 * @throws An error if the timezone is invalid or if the update fails, with the original error as the cause
 */
export async function updateTimezone(timezone: string): Promise<void> {
  if (!isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Unauthorized action: ", authError);
    return;
  }

  const cookieStore = await cookies();
  const prevTimezone = cookieStore.get(COOKIES.TIMEZONE)?.value;
  if (prevTimezone === timezone) {
    // No change in timezone, no need to update
    return;
  }

  const cookieResponse = setUserTimezoneCookie(cookieStore, timezone);
  if (!cookieResponse.ok) {
    console.error("Error setting timezone cookie:", cookieResponse.error);
  }

  try {
    await setUserTimezone(user.id, timezone);
  } catch (error) {
    console.error("Error updating user timezone:", error);
    throw new Error("Failed to update user timezone", { cause: error });
  }
}
