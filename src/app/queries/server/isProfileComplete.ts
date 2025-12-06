import type { User, SupabaseClient } from "@supabase/supabase-js";

/**
 * Checks whether a user's profile is complete by querying the database.
 * A complete profile is determined by the `profile_complete` field in the `users` table.
 * The column holds a boolean value and cannot be null
 *
 * @param user - The user object whose profile completion status needs to be checked
 * @param supabase - The Supabase client instance used to query the database
 * @returns A promise that resolves to true if the user's profile is complete, false otherwise
 * @throws Will throw an error if the database query fails
 *
 * @example
 * ```typescript
 * const isComplete = await isProfileComplete(currentUser, supabaseClient);
 * if (isComplete) {
 *   // Proceed with authenticated flow
 * }
 * ```
 */
export default async function isProfileComplete(
  user: User,
  supabase: SupabaseClient
): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("profile_complete")
    .eq("id", user.id)
    .single<{ profile_complete: boolean }>();

  if (error)
    throw new Error(
      `Failed to check profile completion for user ${user.id}: ${error.message}`,
      { cause: error }
    );

  return data.profile_complete;
}
