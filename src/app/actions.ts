'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

// Further validation can be added here as needed
const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

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
  revalidatePath("/");
  redirect("/profile"); // Redirect to profile or desired page after login (need to create page)
}