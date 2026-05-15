"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Retrieves the timezone for a given user.
 *
 * This function attempts to read the user's timezone from a cookie first to minimize
 * database queries. If not found in cookies, it fetches the timezone from the database
 * and caches it in a cookie for 6 hours.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to the user's timezone string.
 * @throws {Error} If the timezone cannot be fetched from the database or is not found.
 */
export default async function getUserTimezone(userId: string): Promise<string> {
  // Attempt to read the user's timezone from a cookie first to minimize database queries.
  const cookieStore = await cookies();
  let timezone = cookieStore.get("user_timezone")?.value;
  if (timezone) {
    return timezone;
  }

  // If not found in cookies, fetch from the database and cache it in a cookie for 6 hours.
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("timezone")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user timezone:", error);
    throw new Error(error.message);
  }

  timezone = data?.timezone;
  if (!timezone) {
    throw new Error("User timezone not found in database");
  }

  // Cache the timezone in a cookie for 6 hours.
  cookieStore.set("user_timezone", timezone, { maxAge: 6 * 60 * 60 });
  return timezone;
}
