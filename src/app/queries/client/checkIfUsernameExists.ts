import { createSupabaseBrowserClient } from "@/utils/supabase/client";

/**
 * Checks whether a user record exists for the given username using `maybeSingle()`.
 *
 * Queries the "users" table for a single row selecting only "id" where "username" equals the input.
 * - If a row exists, returns true.
 * - If no row exists, returns false (because `maybeSingle()` returns null).
 * - If multiple rows match, Supabase returns an error and this function throws.
 *
 * @param username The username to check. Case sensitivity depends on database collation/config.
 * @returns Promise<boolean> true if a matching user exists; otherwise false.
 * @throws Error If the Supabase query fails (e.g., network/RLS) or multiple matches are found.
 *
 * @remarks Enforce a unique constraint on "username" to avoid multiple-match errors.
 * Consider normalizing usernames (e.g., lowercasing) before calling if uniqueness is case-insensitive.
 *
 * @example
 * const isTaken = await checkIfUsernameExists("alice");
 * if (isTaken) {
 *   console.warn("Username already in use.");
 * }
 */
export default async function checkIfUsernameExists(
  username: string
): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  const normalizedUsername = username.toLowerCase().trim(); // Adjust normalization as needed
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", normalizedUsername)
      .maybeSingle();
    if (error) throw error;
    return data !== null;
  } catch (error) {
    throw new Error(
      `Error checking existing user: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
