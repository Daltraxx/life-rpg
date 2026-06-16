/**
 * Type definitions for cookie management in the application.
 *
 * This file defines interfaces and types related to cookie operations, 
 * including getting, setting, and deleting cookies. 
 * It provides a structured way to handle cookie interactions across the application, 
 * ensuring consistency and type safety when working with cookies in both server and client contexts.
 *
 * @module CookieTypes
 */

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

/**
 * Options for configuring cookie behavior when setting a cookie.
 *
 * @interface CookieOptions
 * @property {number} [maxAge] - The maximum age of the cookie in seconds. After this time, the cookie will expire.
 * @property {Date} [expires] - The exact date and time when the cookie should expire. Overrides maxAge if both are provided.
 * @property {string} [path] - The URL path that must exist in the requested URL for the browser to send the cookie header.
 * @property {string} [domain] - The domain that must be present in the requested URL for the browser to send the cookie header.
 * @property {boolean} [secure] - If true, the cookie will only be sent over secure (HTTPS) connections.
 * @property {boolean} [httpOnly] - If true, the cookie cannot be accessed via client-side JavaScript (e.g., document.cookie) and is only sent in HTTP requests.
 * @property {"strict" | "lax" | "none"} [sameSite] - Controls whether the cookie is sent with cross-site requests. 
 * "strict" means the cookie is not sent with any cross-site requests, 
 * "lax" allows the cookie to be sent with top-level navigations and GET requests initiated by third-party websites, 
 * and "none" means the cookie will be sent with all requests regardless of context (requires secure to be true).
 */
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
 * Represents the response from a cookie operation, indicating success or failure.
 *
 * @interface CookieResponse
 * @property {boolean} ok - Indicates whether the cookie operation was successful.
 * @property {string} cookieName - The name of the cookie that was set, retrieved, or deleted.
 * @property {string} [error] - Optional error message if the operation failed.
 */
export interface CookieResponse {
  ok: boolean;
  cookieName: string;
  error?: string;
}

/**
 * Response object for cookie setting operations.
 * @interface SetCookieResponse
 * @property {boolean} ok - Indicates whether the cookie operation was successful.
 * @property {string} cookieName - The name of the cookie that was set or attempted to be set.
 * @property {number} expiresAt - Unix timestamp in milliseconds when the cookie expires.
 * @property {string} [error] - Optional error message if the operation failed.
 */
export type SetCookieResponse = CookieResponse & {
  expiresAt: number;
}

/**
 * Defines the structure of the payload stored in an encoded, signed cookie.
 * This payload is used for securely storing information such as pending verification email addresses.
 *
 * @interface SecureCookiePayload
 * @property {string} value - The value associated with the cookie.
 * @property {number} exp - The expiration time of the cookie in Unix milliseconds.
 * @property {string} nonce - A unique identifier to prevent replay attacks.
 */
export interface SecureCookiePayload {
  value: string;
  exp: number;
  nonce: string;
}
