import { CookieResponse, CookieStore } from "@/utils/types/cookies";

/**
 * Deletes the unverified signup cookie from the cookie store.
 *
 * @param cookieStore - The cookie store instance to delete from
 * @returns An object indicating success or failure of the deletion
 * @returns {Object} The result object
 * @returns {boolean} result.ok - Whether the deletion was successful
 * @returns {string} result.cookieName - The name of the cookie that was deleted
 * @returns {string} [result.error] - Error message if deletion failed
 *
 * @example
 * const result = deleteUnverifiedSignupCookie(cookieStore);
 * if (result.ok) {
 *   console.log("Cookie deleted successfully");
 * }
 */
export default function deleteUnverifiedSignupCookie(
  cookieStore: CookieStore,
): CookieResponse {
  try {
    cookieStore.delete("unverified_signup");
    return {
      ok: true,
      cookieName: "unverified_signup",
    };
  } catch (error) {
    console.error("Failed to delete unverified_signup cookie:", error);
    return {
      ok: false,
      cookieName: "unverified_signup",
      error: "Failed to delete cookie",
    };
  }
}
