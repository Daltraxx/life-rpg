import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type ClientOptions = {
  admin?: boolean;
};

/**
 * Creates and configures a Supabase client for server-side operations in Next.js.
 * 
 * This function initializes a Supabase server client with cookie-based authentication,
 * using Next.js cookie store for session management. It handles both reading and writing
 * cookies required for Supabase authentication.
 * 
 * @param {ClientOptions} options - Configuration options for the Supabase client
 * @param {boolean} [options.admin=false] - When true, uses the service role key for admin operations; 
 * when false, uses the publishable key for standard operations
 * 
 * @returns {Promise<SupabaseClient>} A promise that resolves to a configured Supabase client instance
 * 
 * @throws {Error} When required environment variables (NEXT_PUBLIC_SUPABASE_URL, 
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or SUPABASE_SERVICE_ROLE_KEY when admin is true) are not defined
 * @throws {Error} When cookie operations fail during the setAll process
 * 
 * @example
 * ```typescript
 * // Standard client
 * const supabase = await createSupabaseServerClient({ admin: false });
 * const { data, error } = await supabase.from('users').select('*');
 * 
 * // Admin client with elevated permissions
 * const adminSupabase = await createSupabaseServerClient({ admin: true });
 * await adminSupabase.auth.admin.deleteUser(userId);
 * ```
 * 
 * @remarks
 * This function must be called in server actions or route handlers where Next.js cookies() is available. Cookie errors are logged to the 
 * console before being re-thrown.
 */
export async function createSupabaseServerClient({ admin = false }: ClientOptions = {}): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = admin ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set."
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          console.error("Failed to set cookies:", error);
          throw error;
        }
      },
    },
  });
}
