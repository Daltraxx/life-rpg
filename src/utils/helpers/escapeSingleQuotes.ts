/**
 * Escapes single quotes in a string for safe inclusion as a single-quoted literal
 * in PostgreSQL (including Supabase) SQL statements.
 *
 * It doubles every single quote (') per PostgreSQL rules, then wraps the entire
 * result in single quotes. This matches the standard string literal escaping
 * convention: ABC'D  ->  'ABC''D'.
 *
 * Important:
 * - Prefer parameterized queries (e.g. using Supabase client helpers) to avoid
 *   SQL injection risks; use this only when you must manually build a literal.
 * - Do NOT use this for identifiers (table/column names); it is only for string values.
 *
 * Example:
 * ```ts
 * const rawEmail = "o'hara@example.com";
 * const sqlLiteral = escapeSingleQuotes(rawEmail);
 * // sqlLiteral === `'o''hara@example.com'`
 * // Can be interpolated into a VALUES clause, e.g.:
 * // INSERT INTO users (email) VALUES (${sqlLiteral});
 * ```
 *
 * @param input The raw string value that may contain single quotes.
 * @returns A PostgreSQL-safe single-quoted string literal with internal quotes escaped.
 */
export default function escapeSingleQuotes(input: string): string {
  // Escape single quotes by doubling them
  const escaped = input.replace(/'/g, "''");
  // Wrap the escaped string in single quotes
  return `'${escaped}'`;
}