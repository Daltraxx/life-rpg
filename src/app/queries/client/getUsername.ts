import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Retrieves the username for a given authenticated user from the Supabase database.
 *
 * @param authUser - The authenticated user object containing the user's ID
 * @param supabase - The Supabase client instance used to query the database
 * @returns A promise that resolves to the username string if found, or null if not found
 *
 * @throws Will throw an error if the database query fails with a code other than PGRST116 (no data found)
 *
 * @example
 * ```typescript
 * const username = await getUsername(authUser, supabaseClient);
 * if (username) {
 *   console.log(`User's username: ${username}`);
 * }
 * ```
 */
export default async function getUsername(
  authUser: User,
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", authUser.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // If error is something other than no data found, throw it
      throw error;
    }

    return data?.username ?? null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
