export type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

/**
 * Represents a store for managing browser cookies.
 * Provides methods to get, set, and delete cookie values.
 *
 * @interface CookieStore
 *
 * @example
 * ```typescript
 * const cookieStore: CookieStore = // ... implementation
 *
 * // Get a cookie
 * const cookie = cookieStore.get('session');
 * if (cookie) {
 *   console.log(cookie.value);
 * }
 *
 * // Set a cookie
 * cookieStore.set('session', 'abc123', { maxAge: 3600 });
 *
 * // Delete a cookie
 * cookieStore.delete('session');
 * ```
 */
export interface CookieStore {
  /**
   * Retrieves a cookie by name.
   *
   * @param name - The name of the cookie to retrieve
   * @returns An object containing the cookie value if found, undefined otherwise
   */
  get(name: string): { value: string } | undefined;
  /**
   * Sets a cookie with the specified name and value.
   *
   * @param name - The name of the cookie to set
   * @param value - The value to store in the cookie
   * @param options - Optional configuration for the cookie (e.g., expiration, path, domain)
   */
  set(name: string, value: string, options?: CookieOptions): void;
  /**
   * Deletes a cookie by name.
   *
   * @param name - The name of the cookie to delete
   */
  delete(name: string): void;
}
