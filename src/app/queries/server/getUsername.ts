import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Retrieves the username for the currently authenticated user.
 * @returns {Promise<string>} The username of the authenticated user.
 * @throws {Error} If the user is not authenticated or if there's an error fetching the username.
 */
export default async function getUsername(): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching username:", error);
    throw new Error(error.message);
  }
  return data.username;
}
