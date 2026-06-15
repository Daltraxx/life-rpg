"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LoginSchema, LoginState } from "@/utils/validations/login";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import resendVerificationEmail from "@/app/queries/server/resendVerificationEmail";

/**
 * Authenticates a user by processing login form data and establishing a session.
 * 
 * @param _prevState - Previous login state (not used in this implementation but can be useful for future enhancements)
 * @param formData - Form data containing email and password credentials
 * @returns A promise resolving to the login state with either success redirect or error details
 * 
 * @description
 * This server action:
 * 1. Initializes a Supabase client for server-side authentication
 * 2. Validates form data against LoginSchema
 * 3. Attempts to authenticate with Supabase using email/password
 * 4. On success, revalidates the cache and redirects to /profile
 * 5. On failure, returns descriptive error messages for client-side display
 * 
 * @throws {Error} Implicitly via redirect() on successful authentication
 * 
 * @example
 * ```typescript
 * const [errorState, formAction, isPending] = useActionState(
     login,
     initialLoginState,
   );
 * ```
 * 
 * @remarks
 * - Supabase client creation errors return a generic server error to avoid credential leakage
 * - Field validation uses Zod's z.flattenError for error handling
 * - Performance consideration: Consider targeted cache revalidation for specific routes
 * - Requires a /profile page to be implemented for redirect destination
 */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase client creation failed:", error);
    return {
      message: "Internal server error. Please try again later.",
    };
  }

  const rawFormData = Object.fromEntries(formData);

  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      // NOTE: validatedFields.error.flatten() is deprecated in Zod v4, use z.flattenError instead
      errors: z.flattenError(validatedFields.error).fieldErrors, // TODO: Untested
      message: "Fields not valid. Failed to log in.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword(
    validatedFields.data,
  );

  if (error) {
    console.error("Login failed:", { cause: error });
    if (error.status === 400) {
      if (error.code === "email_not_confirmed") {
        try {
          await resendVerificationEmail(validatedFields.data.email, supabase);
        } catch (resendError) {
          console.error("Failed to resend verification email:", { cause: resendError });
          return {
            message: "Email not confirmed and failed to resend verification email. Please try again later.",
          };
        }
        return {
          message:
            "Email not confirmed. Please check your inbox for a confirmation email.",
        };
      }
      return {
        message: "Invalid email or password. Please try again.", // Avoid exposing specific failure reasons for security
      };
    }

    return {
      message:
        "An unexpected error occurred during login. Please try again later.",
    };
  }

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}
