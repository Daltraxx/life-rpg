import { createSupabaseServerClient } from "@/utils/supabase/server";
import getProfileCompletionStatus from "@/app/queries/server/get-profile-completion-status";
import type { QueryResponse } from "@/utils/types/query-response";

/**
 * Checks whether the authenticated user's profile is complete.
 * This function should only be called on the server side
 * where the authenticated user's profile completion status is needed.
 *
 * This function retrieves the current user's profile completion status from their app metadata.
 * If the status is not set, it queries the database to determine completion status and caches
 * the result in the user's app metadata.
 *
 * @returns {Promise<QueryResponse<boolean>>} A promise that resolves to a QueryResponse object containing the profile completion status.
 *
 * @remarks
 * - If an error occurs while fetching the authenticated user, the function throws.
 *   The caller (Header component) handles this by rendering fallback UI without the options menu.
 * - This function is intended to be used in server components or API routes
 *   where access to the authenticated user's profile completion status is needed.
 */
export const getResolvedProfileCompletionStatus = async (): Promise<
  QueryResponse<boolean>
> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    const authError = error ?? new Error("No authenticated user found");
    console.error("Error fetching authenticated user:", { error: authError });
    return { data: null, error: authError };
  }

  const profileCompleteMetadataValue = user.app_metadata?.profile_complete;
  if (typeof profileCompleteMetadataValue === "boolean") {
    return { data: profileCompleteMetadataValue, error: null };
  }

  const { data: isProfileComplete, error: queryError } =
    await getProfileCompletionStatus(user.id, supabase);
  if (queryError) {
    console.error("Error resolving profile completion status:", {
      error: queryError,
    });
    return { data: null, error: queryError };
  }

  return { data: isProfileComplete, error: null };
};
