/**
 * Escapes special ILIKE wildcard characters in a username to prevent unintended pattern matching.
 * 
 * This function escapes the following characters in order:
 * 1. Backslashes (\) - escaped first to avoid double-escaping
 * 2. Percent signs (%) - ILIKE wildcard for any number of characters
 * 3. Underscores (_) - ILIKE wildcard for a single character
 * 
 * @param normalizedUsername - The normalized username string to escape
 * @returns The escaped username string safe for use in ILIKE queries
 * 
 * @example
 * ```typescript
 * getEscapedUsername("user_name%") // Returns "user\_name\%"
 * getEscapedUsername("path\\to\\user") // Returns "path\\\\to\\\\user"
 * 
 * // SQL Usage (PostgreSQL):
 * // SELECT * FROM users WHERE username ILIKE ${escapedUsername} ESCAPE '\'
 * 
 * // Supabase Usage with ILIKE:
 * const escapedUsername = getEscapedUsername("user_name%");
 * const { data, error } = await supabase
 *   .from("users")
 *   .select("*")
 *   .ilike("username", escapedUsername, { escape: '\\' });
 * 
 * // Supabase Usage with OR condition:
 * const escapedUsername = getEscapedUsername("user_name%");
 * const { data, error } = await supabase
 *   .from("users")
 *   .select("*")
 *   .or(`username.ilike.${escapedUsername} ESCAPE '\\',email.eq.${escapedEmail}`);
 * ```
 */
export default function getEscapedUsername(normalizedUsername: string): string {
  // Escape ILIKE wildcards (% and _) to prevent unintended pattern matching
  return normalizedUsername
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/%/g, "\\%") // Escape percent signs
    .replace(/_/g, "\\_"); // Escape underscores
}