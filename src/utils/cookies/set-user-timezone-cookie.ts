import { CookieStore, SetCookieResponse } from "@/utils/types/cookies";
import { COOKIES } from "@/utils/constants/server-cookies";

/**
 * Sets a user timezone cookie in the provided cookie store.
 *
 * @param cookieStore - The cookie store instance to set the cookie on
 * @param timezone - The timezone string to store in the cookie
 * @returns A {@link SetCookieResponse} object indicating success or failure
 * @throws Does not throw; errors are caught and returned in the response object
 *
 * @example
 * ```typescript
 * const response = setUserTimezoneCookie(cookieStore, "America/New_York");
 * if (response.ok) {
 *   console.log("Cookie set successfully");
 * }
 * ```
 */
export default function setUserTimezoneCookie(
  cookieStore: CookieStore,
  timezone: string,
): SetCookieResponse {
  const ttlSeconds = 60 * 60 * 24 * 30; // 30 days
  try {
    cookieStore.set(COOKIES.TIMEZONE, timezone, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ttlSeconds,
      path: "/",
    });
    return {
      ok: true,
      cookieName: COOKIES.TIMEZONE,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
  } catch (error) {
    console.error(`Failed to set ${COOKIES.TIMEZONE} cookie:`, error);
    return {
      ok: false,
      cookieName: COOKIES.TIMEZONE,
      expiresAt: 0,
      error: "Failed to set cookie",
    };
  }
}
