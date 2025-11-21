"use server";

import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import checkIfUsernameOrEmailExists from "../queries/server/checkIfUsernameOrEmailExists";

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

  // Query supabase to check if username or email already exists before attempting to create account
  const userData = validatedFields.data;
  let usernameExists, emailExists, rowsFound;
  try {
    const result = await checkIfUsernameOrEmailExists(
      userData.email,
      userData.username
    );
    usernameExists = result.usernameExists;
    emailExists = result.emailExists;
    rowsFound = result.rowsFound;
  } catch (error) {
    console.error("Error checking existing username or email:", error);
    return {
      message:
        "Error checking for existing username and email. Please try again.",
    };
  }

  if (rowsFound > 0) {
    const errorState: SignupState = {
      errors: { username: [], email: [] },
      message: null,
    };
    const errors: SignupState["errors"] = errorState.errors;
    emailExists &&
      errors!.email!.push("An account with this email already exists.");
    usernameExists &&
      errors!.username!.push(
        "Username already taken. Please choose a different username."
      );
    errorState.message = "Cannot create account due to existing credentials.";
    return errorState;
  }

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: { data: { username: userData.username } }, // store username in auth metadata
  });

  // Add logic for other specific error cases.
  if (error) {
    console.error("Error creating account:", error.code);
    // Handle specific error cases
    switch (error.code) {
      // research ways to make password validation match supabase rules
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

  // Handle case where no user data is returned
  if (!data.user) {
    console.error("No user data returned after account creation.");
    return {
      message: "Account creation failed. Please try again.",
    };
  }

  // If account creation succeeds, insert additional user data into the "users" table
  const user: User = data.user;
  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    username: userData.username,
  });
  if (insertError) {
    console.error("Error inserting user data:", insertError);
    return {
      message:
        "Account creation failed during user data setup. Please try again.",
    };
  }

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance.
  // revalidatePath("/"); // Confirm if this is necessary since user needs to verify email before logging in.
  redirect("/verify-email"); // Redirect to verify email page (need to create page)
}
