import { createSupabaseServerClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Checks if a username or email already exists in the users table.
 *
 * @param email - The email address to check for existence in the database
 * @param username - The username to check for existence in the database (case-insensitive)
 * @param signal - Optional AbortSignal to allow cancellation of the database query
 *
 * @returns A promise that resolves to an object containing:
 * - `usernameExists`: boolean indicating if the username already exists
 * - `emailExists`: boolean indicating if the email already exists
 * - `rowsFound`: number of matching rows found in the database
 *
 * @throws {Error} If there's an error querying the database
 *
 * @remarks
 * - The username comparison is case-insensitive and trimmed
 * - Uses Supabase client to query the users table
 * - Supports request cancellation via AbortSignal
 */
export default async function checkIfUsernameOrEmailExists(
  email: string,
  username: string,
  signal?: AbortSignal
): Promise<{
  usernameExists: boolean;
  emailExists: boolean;
  rowsFound: number;
}> {
  const supabase = await createSupabaseServerClient();
  const normalizedUsername = username.toLowerCase().trim();
  let data: { email: string; username: string }[] | null,
    error: PostgrestError | null;
  try {
    let query = supabase
      .from("users")
      .select("email, username")
      .or(`username.ilike.${normalizedUsername}`)
      .or(`email.eq.${email}`);

    if (signal) query = query.abortSignal(signal);

    ({ data, error } = await query);
    if (error) throw error;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Error checking for existing username and email: ${message}`
    );
  }
  let usernameExists = false;
  let emailExists = false;
  let rowsFound = 0;

  if (data && data.length > 0) {
    data.forEach((row) => {
      if (row.username === normalizedUsername) usernameExists = true;
      if (row.email === email) emailExists = true;
    });
    rowsFound = data.length;
  }

  return { usernameExists, emailExists, rowsFound };
}
