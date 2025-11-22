"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates and returns a Supabase admin client using service role credentials.
 *
 * This helper constructs a non-persistent Supabase client intended for trusted
 * server-side operations (e.g., executing RLS-bypassing queries, maintenance tasks,
 * or background jobs). It explicitly disables session persistence, token auto-refresh,
 * and URL session detection to minimize side effects and ensure stateless behavior.
 *
 * Environment Variables:
 * - NEXT_PUBLIC_SUPABASE_URL: The base URL of your Supabase project.
 * - SUPABASE_SERVICE_ROLE_KEY: The service role key (keep this secret; never expose it to clients).
 *
 * Throws:
 * - Error if either required environment variable is missing.
 *
 * Returns:
 * - A Promise that resolves to a configured SupabaseClient instance.
 *
 * Security Notes:
 * - The service role key has elevated privileges and bypasses Row Level Security (RLS).
 *   Use it only in secure, server-side contexts.
 * - Do not pass this client or its key to any client-side code or logs.
 *
 * Example:
 * ```ts
 * const adminClient = await createSupabaseAdminClient();
 * await adminClient.from("users").select("*"); // RLS bypassed if using service role
 * ```
 */
export async function createSupabaseAdminClient(): Promise<SupabaseClient> { 
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}