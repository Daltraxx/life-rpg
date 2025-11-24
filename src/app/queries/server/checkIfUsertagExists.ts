import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Checks whether a user record exists for the given usertag using `maybeSingle()`.
 *
 * Queries the "users" table for a single row selecting only "id" where "usertag" equals the input (case-insensitive).
 * - If a row exists, returns true.
 * - If no row exists, returns false (because `maybeSingle()` returns null).
 * - If multiple rows match, Supabase returns an error and this function throws.
 *
 * @param usertag The usertag to check (normalized: lowercased and trimmed).
 * @param signal Optional AbortSignal to cancel the query if needed.
 * @returns Promise<boolean> true if a matching user exists; otherwise false.
 * @throws Error If the Supabase query fails (e.g., network/RLS) or multiple matches are found.
 *
 * @remarks
 * Enforce a unique constraint on "usertag" to avoid multiple-match errors.
 *
 * @example
 * const isTaken = await checkIfUsertagExists("alice");
 * if (isTaken) {
 *   console.warn("User Tag already in use.");
 * }
 *
 * @example
 * // With AbortController for cancellation
 * const controller = new AbortController();
 * const isTaken = await checkIfUsertagExists("alice", controller.signal);
 * // Later: controller.abort();
 */
export default async function checkIfUsertagExists(
  usertag: string,
  signal?: AbortSignal
): Promise<boolean> {
  // TODO: Add protections such as:
  // Rate-limiting on this endpoint/function call
  // CAPTCHA for repeated checks
  // Honeypot fields to detect automated scanning
  const normalizedUsertag = usertag.toLowerCase().trim();
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("users")
      .select("id")
      .eq("usertag", normalizedUsertag);

    if (signal) query = query.abortSignal(signal);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data !== null;
  } catch (error) {
    throw new Error(
      `Error checking if usertag exists: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error }
    );
  }
}