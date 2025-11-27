"use server";

import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import checkIfUsertagExists from "../queries/server/checkIfUsertagExists";

/**
 * Server action to create a new user account.
 *
 * This function handles the account creation process including:
 * - Validating form data against the signup schema
 * - Checking for existing usertag (note: subject to TOCTOU race condition)
 * - Creating the user account in Supabase Auth
 * - Redirecting to email verification page on success
 *
 * @param prevState - The previous state of the signup form
 * @param formData - The form data submitted by the user
 * @returns A SignupState object containing errors and messages, or redirects on success
 *
 * @remarks
 * **TOCTOU Vulnerability**: The pre-check for existing usertag is subject to a
 * Time-of-Check to Time-of-Use (TOCTOU) race condition. Another user could register
 * with the same usertag between our check and the actual signup call. This is
 * acceptable because:
 * 1. Supabase will ultimately reject duplicate emails with proper error codes
 * 2. The pre-check provides better UX by giving specific feedback earlier
 * 3. The race condition window is very small in practice
 * 4. Usertag uniqueness is enforced by database constraints as a final safeguard
 *
 * @todo Add rate limiting to prevent abuse
 * @todo Consider caching usertag checks to reduce database queries
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
    usertagExists = await checkIfUsertagExists(userData.usertag);
  } catch (error) {
    console.error("Error checking existing usertag:", error);
    return {
      message: "Error checking for existing usertag. Please try again.",
    };
  }

  if (usertagExists) {
    return {
      errors: {
        usertag: ["User Tag already exists. Please choose another."],
      },
    };
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

  // Set cookie to track unverified signup
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("unverified_signup", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });

  // Set a short-lived, HttpOnly, Secure signed cookie for server-side email lookup for display on verify-email page
  // Build a minimal payload with expiry and a nonce
  if (data.user) {
    const payload = {
      email: data.user.email,
      exp: Date.now() + 5 * 60 * 1000, // 5 minutes
      nonce: crypto.randomUUID(),
    };

    // Sign the payload
    const secret = process.env.COOKIE_SIGNING_SECRET;
    if (secret) {
      const serialized = JSON.stringify(payload);
      const signature = crypto
        .createHmac("sha256", secret)
        .update(serialized)
        .digest("base64url");

      const value = `${Buffer.from(serialized).toString(
        "base64url"
      )}.${signature}`;

      // HttpOnly, Secure, short-lived cookie
      cookieStore.set("pending_verification", value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 5, // 5 minutes
        path: "/",
      });
    } else {
      console.warn("COOKIE_SIGNING_SECRET is not set; skipping signed cookie.");
    }
  }

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance.
  // revalidatePath("/"); // Confirm if this is necessary since user needs to verify email before logging in.
  redirect("/verify-email"); // Redirect to verify email page (need to create page)
}
