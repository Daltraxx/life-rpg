import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Retrieves the username for the specified user.
 * @param {string} userId - The ID of the user whose username to fetch.
 * @returns {Promise<string>} The username of the specified user.
 * @throws {Error} If the user is not found or if there's an error fetching the username.
 */
export default async function getUsername(userId: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching username:", error);
    throw new Error(error.message);
  }
  if (!data || !data.username) {
    throw new Error("Username not found for the authenticated user");
  }

  return data.username;
}
