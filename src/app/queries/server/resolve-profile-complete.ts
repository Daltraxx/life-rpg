import type { SupabaseClient } from "@supabase/supabase-js";
import isProfileComplete from "./isProfileComplete";
import { setProfileCompletionStatus } from "./set-profile-completion-status";

/**
 * Resolves the profile completion status for a user.
 *
 * Checks if a user's profile is complete and updates the completion status.
 * If an error occurs during the check or update, the profile is temporarily
 * marked as complete to restrict access to profile creation routes, with
 * resolution deferred to the next request cycle.
 *
 * @param userId - The unique identifier of the user
 * @param supabaseClient - The Supabase client instance for database operations
 * @returns A promise that resolves to a boolean indicating if the profile is complete
 *
 * @example
 * const isComplete = await resolveProfileComplete(userId, supabaseClient);
 */
export const resolveProfileComplete = async (
  userId: string,
  supabaseClient: SupabaseClient,
): Promise<boolean> => {
  let profileComplete: boolean;
  try {
    profileComplete = await isProfileComplete(userId, supabaseClient);
    await setProfileCompletionStatus(userId, profileComplete);
  } catch (error) {
    console.error("Error checking or setting profile completion status:", {
      cause: error,
    });
    // Temporarily set profileComplete to true to restrict access to profile creation routes
    // Resolution will be handled in the next request cycle
    // when the middleware checks the profile completion status again
    profileComplete = true;
  }
  return profileComplete;
};
