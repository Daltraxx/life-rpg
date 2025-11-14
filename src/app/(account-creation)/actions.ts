"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createAccount(
  prevState: SignupState,
  formData: FormData
) {
  //TODO: add rate limiting to prevent abuse
  const supabase = await createSupabaseServerClient();

  const rawFormData = Object.fromEntries(formData);

  const validatedFields = SignupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      // NOTE: validatedFields.error.flatten() is deprecated in Zod v4, use z.flattenError instead
      errors: z.flattenError(validatedFields.error), // test this
      message: "Fields not valid. Failed to create account.",
    } as SignupState;
  }

  const { data, error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  // Add logic for specific error cases like existing email, weak password, etc.
  if (error) {
    console.error("Error creating account:", error.code);
    // Handle specific error cases
    switch (error.code) {
      case "email_exists":
        return {
          message: "An account with this email already exists.",
        } as SignupState;
      // research ways to make password validation match supabase rules
      case "weak_password":
        return {
          message: "Password is too weak. Please choose a stronger password.",
        } as SignupState;
      default:
        return {
          message: "Account creation failed. Please try again.",
        } as SignupState;
    }
  }

  // TODO: if account creation succeeds, insert additional user data into the "users" table

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance.
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page), take into account email confirmation step
}
