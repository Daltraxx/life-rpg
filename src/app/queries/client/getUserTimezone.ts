import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";

/**
 * Retrieves the authenticated user's timezone, using a short-lived cookie as a
 * cache to avoid redundant database reads.
 *
 * @param userId - The ID of the user whose timezone to fetch.
 * @returns The IANA timezone string (e.g. `"America/New_York"`) for the user.
 * @throws An error if the timezone cannot be fetched from the database.
 */
export default async function getUserTimezone(userId: string): Promise<string> {
  // Attempt to read the user's timezone from a cookie first to minimize database queries.
  const timezone = Cookies.get("user_timezone");

  if (timezone) {
    return timezone;
  }

  // If not found in cookies, fetch from the database and cache it in a cookie for 2 hours.
  const supabase = createSupabaseBrowserClient();
  // User ownership is enforced by RLS policies
  const { data, error } = await supabase
    .from("users")
    .select("timezone")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to fetch user timezone: ${error?.message ?? "No data returned"}`,
    );
  }
  
  Cookies.set("user_timezone", data.timezone, { expires: 2 / 24 }); // Cache for 2 hours
  return data.timezone;
}
