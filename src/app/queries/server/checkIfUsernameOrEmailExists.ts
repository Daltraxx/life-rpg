import { createSupabaseServerClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

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
    if (signal) {
      ({ data, error } = await supabase
        .from("users")
        .select("email, username")
        .or(`username.eq.${normalizedUsername},email.eq.${email}`)
        .abortSignal(signal));
    } else {
      ({ data, error } = await supabase
        .from("users")
        .select("email, username")
        .or(`username.eq.${normalizedUsername},email.eq.${email}`));
    }

    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error checking existing username or email: ${error.message}`
      );
    }
    throw error;
  }
  let usernameExists = false;
  let emailExists = false;
  let rowsFound;

  if (data && data.length > 0) {
    data.forEach((row) => {
      if (row.username === normalizedUsername) usernameExists = true;
      if (row.email === email) emailExists = true;
    });
    rowsFound = data.length;
  } else {
    rowsFound = 0;
  }

  return { usernameExists, emailExists, rowsFound };
}
