'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SignupSchema, SignupState } from "@/utils/validations/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createAccount(prevState: SignupState, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const rawFormData = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

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
    return {
      message: "Account creation failed. Please try again.",
    } as SignupState;
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