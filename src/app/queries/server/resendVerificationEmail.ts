import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Resends a verification email to the specified email address.
 * 
 * @param email - The email address to send the verification email to.
 * @param supabaseClient - Optional pre-configured Supabase client. If not provided, a new server client will be created.
 * @throws {Error} Throws an error if the verification email fails to send.
 * @returns {Promise<void>}
 */
export default async function resendVerificationEmail(email: string, supabaseClient?: SupabaseClient) {
  const supabase = supabaseClient || await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
    }
  });

  if (error) {
    console.error("Error resending verification email:", { cause: error });
    throw new Error("Failed to resend verification email. Please try again later.");
  }
}