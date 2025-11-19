import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const supabase = createSupabaseBrowserClient();

/**
 * Determines whether a user record already exists for the given username.
 *
 * Performs a Supabase query against the "users" table, selecting only the "id"
 * field for a single row matching the supplied username. If a row is found,
 * the function resolves to true; otherwise it resolves to false.
 *
 * @param username - The username to check for existence. Collation / case sensitivity
 *                   is determined by the database configuration.
 * @returns Promise resolving to:
 *          - true if a user with the specified username exists.
 *          - false if no such user is found.
 *
 * @throws Error If the underlying Supabase query fails (e.g., network error, permissions issue).
 *
 * @remarks Relies on an initialized, in-scope `supabase` client instance.
 *          Consider normalizing (e.g., lowercasing) usernames before calling
 *          if uniqueness should be case-insensitive.
 *
 * @example
 * ```ts
 * const isTaken = await checkIfUsernameExists("alice");
 * if (isTaken) {
 *   console.warn("Username already in use.");
 * } else {
 *   console.info("Username is available.");
 * }
 * ```
 *
 * @see Supabase client docs: https://supabase.com/docs
 */
export default async function checkIfUsernameExists(
  username: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
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
