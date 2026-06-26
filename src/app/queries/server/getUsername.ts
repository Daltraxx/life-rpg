import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { QueryResponse } from "@/utils/types/query-response";

/**
 * Retrieves the username for the specified user.
 * @param {string} userId - The ID of the user whose username to fetch.
 * @returns {Promise<string>} The username of the specified user.
 * @throws {Error} If the user is not found or if there's an error fetching the username.
 */
export default async function getUsername(
  userId: string,
): Promise<QueryResponse<string>> {
  try {
    const supabase = await createSupabaseServerClient();

    // RLS policies further restrict access to only user data belonging to the authenticated user,
    // so combined with this function only being called on the server,
    // we can be confident that users cannot access data that doesn't belong to them.
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching username:", error);
      return { data: null, error };
    }
    if (!data) {
      return {
        data: null,
        error: new Error(`Username not found`),
      };
    }

    if (!data.username) {
      console.error("Username is null or undefined for authenticated user");
      return {
        data: null,
        error: new Error(`Username is null or undefined`),
      };
    }

    return { data: data.username, error: null };
  } catch (error) {
    console.error(
      "Error creating Supabase client or fetching username:",
      error,
    );
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Failed to fetch username"),
    };
  }
}
