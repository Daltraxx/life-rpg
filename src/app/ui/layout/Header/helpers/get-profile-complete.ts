import isProfileComplete from "@/app/queries/server/isProfileComplete";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { setProfileCompletionStatus } from "@/app/queries/server/set-profile-completion-status";

/**
 * Checks whether the authenticated user's profile is complete.
 *
 * This function retrieves the current user's profile completion status from their app metadata.
 * If the status is not set, it queries the database to determine completion status and caches
 * the result in the user's app metadata.
 *
 * @returns {Promise<boolean>} True if the user's profile is complete, false otherwise.
 * @throws {Error} If there is an error fetching the authenticated user
 * or checking/setting profile completion status.
 *
 * @remarks
 * - If an error occurs while checking or setting the completion status, the function
 *   defaults to returning true to restrict access to profile creation routes.
 *   Resolution is deferred to the next request cycle.
 * - This function is intended to be used in server components or API routes
 *   where access to the authenticated user's profile completion status is needed.
 */
export const getProfileComplete = async (): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    console.warn("Error fetching authenticated user:", { cause: error });
    throw new Error("No authenticated user found", { cause: error });
  }

  let profileComplete = user.app_metadata?.profile_complete;
  if (profileComplete === undefined) {
    try {
      profileComplete = await isProfileComplete(user, supabase);
      await setProfileCompletionStatus(user.id, profileComplete);
    } catch (error) {
      console.error("Error checking or setting profile completion status:", {
        cause: error,
      });
      // Temporarily set profileComplete to true to restrict access to profile creation routes
      // Resolution will be handled in the next request cycle
      // when the middleware checks the profile completion status again
      profileComplete = true;
    }
  }

  return profileComplete;
};
