"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

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