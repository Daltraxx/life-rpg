"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createAccount(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState | void> {
  const supabase = await createSupabaseServerClient();

  const rawFormData = Object.fromEntries(formData);

  const validatedFields = SignupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error), // test this
      message: "Fields not valid. Failed to create account.",
    } as SignupState;
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  // Add logic for specific error cases like existing email, weak password, etc.
  if (error) {
    console.error("Error creating account:", error.code, error.message);
    // Handle specific error cases
    switch (error.code) {
      case "email_exists":
        return {
          message: "An account with this email already exists.",
        };
      // research ways to make password validaation match supabase rules
      case "weak_password":
        return {
          message: "Password is too weak. Please choose a stronger password.",
        };
      default:
        return {
          message: "Account creation failed. Please try again.",
        };
    }
  }

  // Todo: if account creation succeeds, insert additional user data into the "users" table

  // Revalidate the path to update any server components depending on auth state
  // Consider more targeted path revalidation.
  // Revalidating the root path "/" may be broader than necessary.
  // If only specific pages depend on auth state,
  // consider revalidating those paths specifically(e.g., "/profile", "/dashboard").
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}
