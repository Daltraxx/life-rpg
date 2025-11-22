"use server";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

/**
 * Deletes an authenticated user from the Supabase authentication system.
 *
 * This function performs the following operations:
 * 1. Deletes the user from Supabase authentication system
 *
 * Note: Associated data in database tables will only be deleted if you have configured
 * CASCADE foreign key constraints or database triggers. Verify your schema configuration.
 *
 * @param userId - The unique identifier of the user to be deleted
 * @returns A promise that resolves when the user and their data have been successfully deleted
 * @throws {Error} Throws an error with message "Failed to delete user account: [error details]" if the user deletion fails
 *
 * @remarks
 * This function requires admin privileges to delete users from the authentication system.
 * Any errors during the deletion process are logged to the console before throwing.
 * Cascading deletes in the database ensure that all related data for the user is also removed.
 * Ensure that the `userId` provided is valid and corresponds to an existing user.
 * DO NOT USE THIS FUNCTION ON THE CLIENT SIDE TO AVOID SECURITY RISKS.
 *
 * @example
 * ```typescript
 * await deleteAuthUser('user-123-abc');
 * ```
 */
export async function deleteAuthUser(userId: string): Promise<void> {
  // Validate input
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Invalid userId: must be a non-empty string");
  }

  // Add authorization check
  const supabaseAdmin = await createSupabaseAdminClient();
  const {
    data: { user: currentUser },
  } = await supabaseAdmin.auth.getUser();

  if (!currentUser) {
    throw new Error("Unauthorized: No authenticated user");
  }

  // Check if user is deleting their own account OR is an admin
  const isOwnAccount = currentUser.id === userId;
  const isAdmin = currentUser.user_metadata?.role === "admin"; // TODO: Implement role management system and adjust as needed

  if (!isOwnAccount && !isAdmin) {
    throw new Error(
      "Unauthorized: Insufficient permissions to delete this user"
    );
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Error deleting user:", error);
    throw new Error(`Failed to delete user account: ${error.message}`);
  }
}
