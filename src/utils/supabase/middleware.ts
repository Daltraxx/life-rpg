import isProfileComplete from "@/app/queries/server/isProfileComplete";
import { createServerClient } from "@supabase/ssr";
import { AuthError, AuthSessionMissingError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const getUserErrorLog = (error: AuthError, request: NextRequest) => {
  const errorDetails = {
    name: error.name,
    path: request.nextUrl.pathname,
    message: error.message,
    method: request.method,
    status: error.status || "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return errorDetails;
};

/**
 * Updates the user session by validating authentication state and managing cookies.
 *
 * This middleware function creates a Supabase server client, validates the current user's
 * authentication status, and handles redirects for protected routes. It ensures proper
 * cookie management between the browser and server to maintain session consistency.
 *
 * @param request - The incoming Next.js request object
 * @returns A Next.js response object with updated session cookies
 *
 * @throws {Error} Throws an error in development mode if Supabase environment variables are missing
 *
 * @remarks
 * - In production, missing environment variables redirect to `/error` instead of throwing
 * - The function checks authentication and redirects unauthenticated users from protected routes to `/`
 * - Public paths that don't require authentication: `/`, `/create-account`, `/auth`, `/error`
 * - The returned `supabaseResponse` object must be returned as-is to prevent session termination
 * - Cookie synchronization between browser and server is critical for maintaining user sessions
 *
 * @example
 * ```typescript
 * // In middleware.ts
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * ```
 */
export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set."
      );
    } else {
      console.error("Missing Supabase environment variables");
      const url = request.nextUrl.clone();
      url.pathname = "/error"; // TODO: create error page
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const unverifiedSignupCookie = request.cookies.get("unverified_signup");
  const publicPaths = [
    "/",
    "/create-account",
    "/auth",
    "/error",
    ...(unverifiedSignupCookie ? ["/verify-email"] : []),
  ];

  // In development, allow unrestricted access when desired to account setup and verify email pages
  // TODO: Consider removing in production, make sure to test normal user flow
  if (
    process.env.NODE_ENV === "development" &&
    process.env.UNRESTRICTED_DEV_MODE_ACCESS === "true"
  ) {
    publicPaths.push("/verify-email", "/account-setup");
  }

  if (unverifiedSignupCookie && user?.email_confirmed_at) {
    // User has verified email - remove the cookie
    supabaseResponse.cookies.delete("unverified_signup");
  }

  const pathname = request.nextUrl.pathname;
  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
  );

  if (error) {
    if (error instanceof AuthSessionMissingError && isPublicPath) {
      if (process.env.NODE_ENV === "development") {
        console.debug("No session on public path:", pathname);
      }
    } else {
      const errorDetails = getUserErrorLog(error, request);
      console.error("Auth errors in middleware:\n", errorDetails);
      // Treat auth errors as unauthenticated
    }
  }

  if (!user && !isPublicPath) {
    // no user and is not public path, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Paths accessible to users who have signed up but not yet verified their email
  const authenticatedUserPaths = ["/account-setup", "/profile"];
  const isAuthenticatedUserPath = authenticatedUserPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (user && !isAuthenticatedUserPath) {
    // Redirect authenticated users to complete profile or profile page
    const url = request.nextUrl.clone();
    try {
      const profileComplete = await isProfileComplete(user, supabase);
      // TODO: create profile page
      url.pathname = profileComplete ? "/profile" : "/account-setup";
      return NextResponse.redirect(url);
    } catch (error) {
      console.error("Error fetching user profile completion data:", error);
      url.pathname = "/error";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
