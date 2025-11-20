"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Deletes an authenticated user and their associated data from the system.
 * 
 * This function performs the following operations:
 * 1. Deletes the user from Supabase authentication system
 * 2. Removes the user's data from the "users" table
 * 3. Signs out the current session
 * 
 * @param userId - The unique identifier of the user to be deleted
 * @returns A promise that resolves when the user and their data have been successfully deleted
 * @throws {Error} Throws an error with message "Failed to delete user account." if the user deletion fails
 * 
 * @remarks
 * This function requires admin privileges to delete users from the authentication system.
 * Any errors during the deletion process are logged to the console before throwing.
 * 
 * @example
 * ```typescript
 * await deleteAuthUser('user-123-abc');
 * ```
 */
export async function deleteAuthUser(userId: string): Promise<void> {
  const supabaseAdmin = await createSupabaseServerClient({ admin: true });
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user account.");
  }

  // Delete user data from other tables if exists
  await supabaseAdmin.from("users").delete().eq("id", userId);

  await supabaseAdmin.auth.signOut();
}