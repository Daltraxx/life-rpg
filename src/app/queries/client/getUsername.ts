import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Retrieves the username for a given authenticated user from the Supabase database.
 *
 * @param authUser - The authenticated user object containing the user's ID
 * @param supabase - The Supabase client instance used to query the database
 * @returns A promise that resolves to the username string if found, or null if not found or an error occurs
 * @throws Will log an error to the console if the database query fails
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
      .eq("id", authUser?.id)
      .single();

    if (error) throw error;

    if (data) return data.username;

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
