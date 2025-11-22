"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Deletes an authenticated user and their associated data from the system (via cascade).
 * 
 * This function performs the following operations:
 * 1. Deletes the user from Supabase authentication system
 * 
 * @param userId - The unique identifier of the user to be deleted
 * @returns A promise that resolves when the user and their data have been successfully deleted
 * @throws {Error} Throws an error with message "Failed to delete user account." if the user deletion fails
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
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new Error('Invalid userId: must be a non-empty string');
  }

  const supabaseAdmin = await createSupabaseServerClient({ admin: true });
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Error deleting user:", error);
    throw new Error(`Failed to delete user account: ${error.message}`);
  }
}