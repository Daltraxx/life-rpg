import { createServerClient } from "@supabase/ssr";
import { AuthError, AuthSessionMissingError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../generatedTypes/supabase";
import isProfileComplete from "@/app/queries/server/isProfileComplete";
import { ROUTES } from "@/utils/constants/routes";
import { COOKIES } from "@/utils/constants/cookies";
import { setProfileCompletionStatus } from "@/app/queries/server/set-profile-completion-status";

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
 * - In production, missing environment variables redirect to error page instead of throwing
 * - The function checks authentication and redirects unauthenticated users from protected routes to the login page
 * - Public paths that don't require authentication: home (login) page, signup page, authentication page, error page,
 *   and optionally the email verification page if the unverified signup cookie is present
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
  request: NextRequest,
): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.",
      );
    } else {
      console.error("Missing Supabase environment variables");
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.ERROR; // TODO: create error page
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
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

  const unverifiedSignupCookie = request.cookies.get(COOKIES.UNVERIFIED_SIGNUP);
  const unauthenticatedPaths = [
    ROUTES.HOME,
    ROUTES.SIGNUP,
    ROUTES.AUTH,
    ROUTES.ERROR,
    ...(unverifiedSignupCookie ? [ROUTES.VERIFY_EMAIL] : []),
  ];

  if (unverifiedSignupCookie && user?.email_confirmed_at) {
    // User has verified email - remove the cookie
    supabaseResponse.cookies.delete(COOKIES.UNVERIFIED_SIGNUP);
  }

  const pathname = request.nextUrl.pathname;
  const isUnauthenticatedPath = unauthenticatedPaths.some(
    (path) =>
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );

  if (error) {
    if (error instanceof AuthSessionMissingError) {
      // Treat as expected behavior, as this can occur when a user is not logged in or the session has expired. No action needed.
      // Silenced in production to avoid noise in logs, 
      // but (TODO) consider adding monitoring for unexpected spikes in these errors 
      // which could indicate issues with cookie handling or session management.
      if (process.env.NODE_ENV === "development") {
        console.debug(
          `No session on ${isUnauthenticatedPath ? "public" : "protected"} path:`,
          pathname,
        );
      }
    } else {
      const errorDetails = getUserErrorLog(error, request);
      console.error("Auth errors in middleware:\n", errorDetails);
      // Treat auth errors as unauthenticated
    }
  }

  if (!user && !isUnauthenticatedPath) {
    // no user and is not unauthenticated path, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Paths accessible to authenticated (email-verified) users
  const authenticatedUserPaths = [
    ROUTES.CREATE_PROFILE,
    ROUTES.EDIT_PROFILE,
    ROUTES.PROFILE,
    ROUTES.ERROR,
    ROUTES.AUTH,
  ];
  const isAuthenticatedUserPath = authenticatedUserPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // If user is authenticated but profile_complete is not set in metadata, check profile completion status and update metadata
  let profileComplete = user?.app_metadata?.profile_complete; // Initialize here to track value since current request will not immediately reflect metadata updates
  if (user && profileComplete === undefined) {
    try {
      profileComplete = await isProfileComplete(user, supabase);
      // Update user metadata with profile completion status to avoid db queries in middleware and client components
      await setProfileCompletionStatus(user.id, profileComplete);
    } catch (error) {
      console.warn("Error updating user metadata:", { cause: error });
      // Not critical enough to fail the whole operation, so we proceed without returning an error state
      // Middleware will check profile completion status on next request and update metadata accordingly
      // For now, set profileComplete to true to restrict access to profile creation routes
      profileComplete = true;
    } 
  }

  if (user && !isAuthenticatedUserPath) {
    // Redirect authenticated users to complete profile or profile page based on profile completion status in metadata
    const url = request.nextUrl.clone();
    url.pathname = profileComplete ? ROUTES.PROFILE : ROUTES.CREATE_PROFILE;
    return NextResponse.redirect(url);
  }

  if (pathname === ROUTES.CREATE_PROFILE && profileComplete) {
    // If user tries to access create-profile but they already have a complete profile, redirect to edit-profile
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.EDIT_PROFILE;
    return NextResponse.redirect(url);
  }

  if (pathname === ROUTES.EDIT_PROFILE && !profileComplete) {
    // If user tries to access edit-profile but they don't have a complete profile, redirect to create-profile
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.CREATE_PROFILE;
    return NextResponse.redirect(url);
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
