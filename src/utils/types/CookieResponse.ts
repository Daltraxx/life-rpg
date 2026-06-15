/**
 * Response object for cookie operations.
 * @interface CookieResponse
 * @property {boolean} ok - Indicates whether the cookie operation was successful.
 * @property {string} cookieName - The name of the cookie that was set or attempted to be set.
 * @property {number} expiresAt - Unix timestamp in milliseconds when the cookie expires.
 * @property {string} [error] - Optional error message if the operation failed.
 */
export interface CookieResponse {
  ok: boolean;
  cookieName: string;
  expiresAt: number;
  error?: string;
}
