import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import setPendingVerificationEmailCookie from "@/utils/cookies/setPendingVerificationEmailCookie";
import { cookies } from "next/headers";
import setUnverifiedSignupCookie from "@/utils/cookies/setUnverifiedSignupCookie";
import { ROUTES } from "@/utils/constants/routes";
import { EmailSchema } from "@/utils/validations/email";

/**
 * Resends a verification email to the specified email address.
 * This function attempts to resend a verification email using the Supabase client. 
 * If the `supabaseClient` parameter is not provided, it creates a new server client instance. 
 * It sets a pending verification email cookie with the provided email address
 * for use on the verify-email page.
 * It sets an unverified signup cookie to allow access to the verify-email page.
 * 
 * @param email - The email address to send the verification email to.
 * @param supabaseClient - Optional pre-configured Supabase client. If not provided, a new server client will be created.
 * @throws {Error} Throws an error if the verification email fails to send.
 * @returns {Promise<void>}
 * @remarks
 * - The caller is responsible for handling any errors thrown by this function, which may include logging and user feedback.
 * - The caller is responsible for redirecting the user to the appropriate page after this function is called, such as the verify-email page.
 */
export default async function resendVerificationEmail(email: string, supabaseClient?: SupabaseClient) {
  // Validate the email address before attempting to resend the verification email
  const validatedEmail = EmailSchema.safeParse(email);
  if (!validatedEmail.success) {
    console.error("Invalid email address provided for resending verification email:", { email, error: validatedEmail.error });
    throw new Error("Invalid email address. Please provide a valid email.", { cause: validatedEmail.error });
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.error("Missing NEXT_PUBLIC_BASE_URL environment variable");
    throw new Error("Internal server error. Please try again later.");
  }
  const supabase = supabaseClient || await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${baseUrl}${ROUTES.CREATE_PROFILE}`,
    }
  });

  if (error) {
    console.error("Error resending verification email:", { cause: error });
    throw new Error("Failed to resend verification email. Please try again later.", { cause: error });
  }

  const cookieStore = await cookies();
  setUnverifiedSignupCookie(cookieStore);
  setPendingVerificationEmailCookie(email, cookieStore);
  // If either of the cookies fail, the user is still alerted to check their email, so we don't throw an error in that case. 
  // The verify-email page will handle the case where the pending verification email cookie is missing.
}