import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../generatedTypes/supabase";

let client: SupabaseClient<Database> | undefined;

/**
 * Creates or returns the cached Supabase browser client.
 * The client is initialized once and reused for subsequent calls.
 * @returns {SupabaseClient} The Supabase client instance
 * @throws {Error} If required environment variables are not set
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.",
    );
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return client;
}
