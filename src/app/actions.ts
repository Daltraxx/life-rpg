"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LoginSchema, LoginState } from "@/utils/validations/login";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function login(prevState: LoginState, formData: FormData) {
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
      errors: z.flattenError(validatedFields.error), // test this
      message: "Fields not valid. Failed to log in.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword(
    validatedFields.data
  );

  if (error) {
    console.error("Login failed:", error.message);
    return {
      message: "Authentication failed. Please check your credentials.",
    };
  }

  // TODO: Consider targeted revalidation (e.g., "/profile", "/dashboard") instead of root for better performance
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}
