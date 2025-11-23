
/**
 * Escapes an email address by doubling any embedded double quote characters
 * and then wrapping the entire result in double quotes. This is useful when
 * preparing values for CSV output or other contexts requiring RFC 4180–style
 * quoted fields, or preparing for database queries, ensuring internal quotes are preserved without breaking
 * the enclosing string delimiters.
 *
 * The transformation follows:
 * - Every occurrence of " becomes "".
 * - The whole string is then wrapped in leading and trailing double quotes.
 *
 * This function does not perform validation of the email format; it strictly
 * applies quoting/escaping logic to the provided string.
 *
 * @param email - The raw email address (or arbitrary string) to escape.
 * @returns A new string with internal quotes doubled and wrapped in outer quotes.
 *
 * @example
 * // Basic usage:
 * const result = getEscapedEmail('user@example.com');
 * // result => "user@example.com"
 *
 * @example
 * // Email containing double quotes:
 * const result = getEscapedEmail('user"name@example.com');
 * // result => "user""name@example.com"
 *
 * @example
 * // Safe for CSV insertion:
 * const csvLine = `${getEscapedEmail('user"name@example.com')},42`;
 * // Produces: "user""name@example.com",42
 * 
 * @example 
 * // Safe for Supabase query:
 * const supabase = createSupabaseClient();
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 *   .eq('email', getEscapedEmail('user"name@example.com'));
 */
export default function getEscapedEmail(email: string): string {
  // Escape double quotes by doubling them
  const escapedEmail = email.replace(/"/g, '""');
  // Wrap the email in double quotes
  return `"${escapedEmail}"`;
}