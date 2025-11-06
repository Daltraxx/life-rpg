'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

// Further validation can be added here as needed
const SignupSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
});

export type SignupState = {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

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

  if (error) {
    return {
      message: "Account creation failed. Please try again.",
    } as SignupState;
  }
  
  // Revalidate the path to update any server components depending on auth state
  // Consider more targeted path revalidation.
  // Revalidating the root path "/" may be broader than necessary.
  // If only specific pages depend on auth state,
  // consider revalidating those paths specifically(e.g., "/profile", "/dashboard").
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}