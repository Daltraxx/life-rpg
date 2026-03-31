"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LoginSchema, LoginState } from "@/utils/validations/login";
import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Authenticates a user by processing login form data and establishing a session.
 * 
 * @param _prevState - Previous login state (not used in this implementation but can be useful for future enhancements)
 * @param formData - Form data containing email and password credentials
 * @returns A promise resolving to the login state with either success redirect or error details
 * 
 * @description
 * This server action:
 * 1. Initializes a Supabase client for server-side authentication
 * 2. Validates form data against LoginSchema
 * 3. Attempts to authenticate with Supabase using email/password
 * 4. On success, revalidates the cache and redirects to /profile
 * 5. On failure, returns descriptive error messages for client-side display
 * 
 * @throws {Error} Implicitly via redirect() on successful authentication
 * 
 * @example
 * ```typescript
 * const form = useFormState(login, initialState);
 * ```
 * 
 * @remarks
 * - Supabase client creation errors return a generic server error to avoid credential leakage
 * - Field validation uses Zod's z.flattenError for error handling
 * - Performance consideration: Consider targeted cache revalidation for specific routes
 * - Requires a /profile page to be implemented for redirect destination
 */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
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
      errors: z.flattenError(validatedFields.error).fieldErrors, // test this
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
