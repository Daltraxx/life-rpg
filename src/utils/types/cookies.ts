/**
 * Represents a generic cookie storage interface for managing browser cookies.
 * 
 * This minimal interface provides a simplified abstraction for cookie operations,
 * allowing for different implementations of cookie storage mechanisms.
 * 
 * @interface CookieStore
 * 
 * @example
 * ```typescript
 * const cookieStore: CookieStore = await cookies();
 * 
 * // Get a cookie
 * const token = cookieStore.get('auth_token');
 * if (token) {
 *   console.log(token.value);
 * }
 * 
 * // Set a cookie
 * cookieStore.set('user_id', '12345', { maxAge: 3600 });
 * ```
 */

/**
 * Retrieves a cookie by name.
 * 
 * @param name - The name of the cookie to retrieve
 * @returns An object containing the cookie value if found, undefined otherwise
 */

/**
 * Sets a cookie with the specified name and value.
 * 
 * @param name - The name of the cookie to set
 * @param value - The value to store in the cookie
 * @param options - Optional configuration options for the cookie (e.g., maxAge, path, domain, secure, httpOnly)
 * @returns void
 */
export interface CookieStore {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}
