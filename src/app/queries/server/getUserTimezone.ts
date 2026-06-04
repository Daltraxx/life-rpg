import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cache } from "react";

/**
 * Fetches the timezone for a specific user from the database.
 *
 * @param userId - The unique identifier of the user
 * @returns A promise that resolves to the user's timezone string
 * @throws {Error} If the database query fails or returns an error
 * @throws {Error} If the user's timezone is not found in the database
 *
 * @remarks
 * This function is wrapped with React's `cache()` to memoize results during a single server render,
 * preventing duplicate database queries for the same user within the same render cycle.
 */
const getUserTimezone = cache(async function getUserTimezone(
  userId: string,
): Promise<string> {
  const supabase = await createSupabaseServerClient();
  // RLS policies further restrict access to only user data belonging to the authenticated user,
  // so combined with this function only being called on the server,
  // we can be confident that users cannot access data that doesn't belong to them.
  const { data, error } = await supabase
    .from("users")
    .select("timezone")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user timezone:", error);
    throw new Error(error.message);
  }

  const timezone = data?.timezone;
  if (!timezone) {
    throw new Error("User timezone not found in database");
  }

  return timezone;
});

export default getUserTimezone;
