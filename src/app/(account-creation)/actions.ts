"use server";

import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import checkIfUsernameOrEmailExists from "../queries/server/checkIfUsernameOrEmailExists";
import checkIfUsertagExists from "../queries/client/checkIfUsertagExists";

/**
 * Server action to create a new user account.
 *
 * This function handles the account creation process including:
 * - Validating form data against the signup schema
 * - Checking for existing username/email (note: subject to TOCTOU race condition)
 * - Creating the user account in Supabase Auth
 * - Redirecting to email verification page on success
 *
 * @param prevState - The previous state of the signup form
 * @param formData - The form data submitted by the user
 * @returns A SignupState object containing errors and messages, or redirects on success
 *
 * @remarks
 * **TOCTOU Vulnerability**: The pre-check for existing username/email is subject to a
 * Time-of-Check to Time-of-Use (TOCTOU) race condition. Another user could register
 * with the same credentials between our check and the actual signup call. This is
 * acceptable because:
 * 1. Supabase will ultimately reject duplicate emails with proper error codes
 * 2. The pre-check provides better UX by giving specific feedback earlier
 * 3. The race condition window is very small in practice
 * 4. Username uniqueness is enforced by database constraints as a final safeguard
 *
 * @todo Add rate limiting to prevent abuse
 * @todo Consider caching username/email checks to reduce database queries
 */
export async function createAccount(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  //TODO: add rate limiting to prevent abuse
  const supabase = await createSupabaseServerClient();

  const rawFormData = Object.fromEntries(formData);

  const validatedFields = SignupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      // NOTE: validatedFields.error.flatten() is deprecated in Zod v4, use z.flattenError instead
      errors: z.flattenError(validatedFields.error).fieldErrors, // TODO: test this
      message: "Fields not valid. Failed to create account.",
    };
  }

  // Query supabase to check if usertag already exists before attempting to create account
  // WARNING: TOCTOU vulnerability - this check is not atomic with the signup operation below.
  // See function documentation for why this is acceptable.
  const userData = validatedFields.data;
  let usertagExists = false;
  try {
    usertagExists = await checkIfUsertagExists(
      userData.usertag
    );
  } catch (error) {
      console.error("Error checking existing usertag:", error);
      return {
      message:
        "Error checking for existing usertag. Please try again.",
    };
  }

  if (usertagExists) {
    return {
      errors: {
        usertag: ["User Tag already exists. Please choose another."]
      }
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: { username: userData.username, usertag: userData.usertag },
    }, // store username and usertag in auth metadata
  });

  // Inserting in users table is handled by Supabase trigger

  // TODO: Add logic for other specific error cases if necessary.
  if (error) {
    console.error("Error creating account:", error.code);
    // Handle specific error cases
    switch (error.code) {
      // research ways to make password validation match supabase rules
      case "email_exists":
        return {
          message: "An account with this email already exists.",
        };
      case "user_already_exists":
        return {
          message: "An account with this email already exists.",
        };
      case "invalid_password":
        return {
          message:
            "Password does not meet the required criteria. Please choose a stronger password.",
        };
      case "weak_password":
        return {
          message: "Password is too weak. Please choose a stronger password.",
        };
      case "invalid_email":
        return {
          message: "The email address is invalid. Please check and try again.",
        };
      case "over_email_send_rate_limit":
        return {
          message:
            "Too many requests. Please wait a while before trying again.",
        };
      default:
        return {
          message: "Account creation failed. Please try again.",
        };
    }
  }

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance.
  // revalidatePath("/"); // Confirm if this is necessary since user needs to verify email before logging in.
  redirect("/verify-email"); // Redirect to verify email page (need to create page)
}
