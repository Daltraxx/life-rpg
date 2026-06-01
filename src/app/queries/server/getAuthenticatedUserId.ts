import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Retrieves the authenticated user's ID from the Supabase session.
 * @returns A promise that resolves to the authenticated user's ID.
 * @throws {Error} If the user is not authenticated or an error occurs during retrieval.
 */
export default async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("User not authenticated");
  }
  return user.id;
}
