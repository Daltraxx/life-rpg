import type { SupabaseClient } from "@supabase/supabase-js";
import type { QueryResponse } from "@/utils/types/query-response";

/**
 * Checks whether a user's profile is complete by querying the database.
 * A complete profile is determined by the `profile_complete` field in the `users` table.
 * The column holds a boolean value and cannot be null
 *
 * @param userId - The ID of the user whose profile completion status needs to be checked
 * @param supabase - The Supabase client instance used to query the database
 * @returns A promise that resolves to a QueryResponse object containing the profile completion status
 *
 * @example
 * ```typescript
 * const { data: isComplete, error } = await getProfileCompletionStatus(userId, supabaseClient);
 * if (isComplete) {
 *   // Proceed with authenticated flow
 * }
 * ```
 */
export default async function getProfileCompletionStatus(
  userId: string,
  supabase: SupabaseClient
): Promise<QueryResponse<boolean>> {
  const { data, error } = await supabase
    .from("users")
    .select("profile_complete")
    .eq("id", userId)
    .single<{ profile_complete: boolean }>();

  if (error) {
    console.error("Error checking profile completion status:", { error });
    return { data: null, error };
  }

  return { data: data.profile_complete, error: null };
}
