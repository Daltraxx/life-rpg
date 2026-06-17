import { createSupabaseAdminClient } from "@/utils/supabase/admin";

/**
 * Updates the profile completion status in the app metadata for a user.
 * @param userId - The ID of the user to update
 * @param isComplete - Whether the profile is complete
 * @throws {Error} If the update fails
 */
export const setProfileCompletionStatus = async (
  userId: string,
  isComplete: boolean,
) => {
  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { profile_complete: isComplete },
  });

  if (error) {
    throw new Error(
      `Failed to update profile completion status for user ${userId}: ${error.message}`,
      { cause: error },
    );
  }
};
