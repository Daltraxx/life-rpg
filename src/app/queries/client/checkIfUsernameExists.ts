import getEscapedUsername from "@/utils/helpers/getEscapedUsername";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

/**
 * Checks whether a user record exists for the given username using `maybeSingle()`.
 *
 * Queries the "users" table for a single row selecting only "id" where "username" equals the input (case-insensitive).
 * - If a row exists, returns true.
 * - If no row exists, returns false (because `maybeSingle()` returns null).
 * - If multiple rows match, Supabase returns an error and this function throws.
 *
 * @param username The username to check (normalized: lowercased and trimmed).
 * @param signal Optional AbortSignal to cancel the query if needed.
 * @returns Promise<boolean> true if a matching user exists; otherwise false.
 * @throws Error If the Supabase query fails (e.g., network/RLS) or multiple matches are found.
 *
 * @remarks
 * Enforce a unique constraint on "username" to avoid multiple-match errors.
 *
 * @example
 * const isTaken = await checkIfUsernameExists("alice");
 * if (isTaken) {
 *   console.warn("Username already in use.");
 * }
 *
 * @example
 * // With AbortController for cancellation
 * const controller = new AbortController();
 * const isTaken = await checkIfUsernameExists("alice", controller.signal);
 * // Later: controller.abort();
 */
export default async function checkIfUsernameExists(
  username: string,
  signal?: AbortSignal
): Promise<boolean> {
  // TODO: Consider adding:
  // Rate-limiting on this endpoint/function call
  // CAPTCHA for repeated checks
  // Honeypot fields to detect automated scanning
  const supabase = createSupabaseBrowserClient();
  const normalizedUsername = username.toLowerCase().trim(); 
  const escapedUsername = getEscapedUsername(normalizedUsername);
  try {
    let query = supabase
      .from("users")
      .select("id")
      .ilike("username", escapedUsername);

    if (signal) query = query.abortSignal(signal);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data !== null;
  } catch (error) {
    throw new Error(
      `Error checking if username exists: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error }
    );
  }
}
