import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { QueryResponse } from "@/utils/types/query-response";

/**
 * Retrieves the authenticated user's ID from the Supabase session.
 * @returns A promise that resolves to a QueryResponse containing the authenticated user's ID.
 */
export default async function getAuthenticatedUserId(): Promise<
  QueryResponse<string>
> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return {
      data: null,
      error: error || new Error("No authenticated user found"),
    };
  }
  return {
    data: user.id,
    error: null,
  };
}
