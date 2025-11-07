'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LoginSchema, LoginState } from "@/utils/validations/login";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function login(prevState: LoginState, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error), // test this
      message: "Fields not valid. Failed to log in.",
    } as LoginState;
  }

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
      message: "Authentication failed. Please check your credentials.",
    } as LoginState;
  }

  // Revalidate the path to update any server components depending on auth state
  // Consider more targeted path revalidation.
  // Revalidating the root path "/" may be broader than necessary. 
  // If only specific pages depend on auth state,
  // consider revalidating those paths specifically(e.g., "/profile", "/dashboard").
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}