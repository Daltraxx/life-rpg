/**
 * Checks if a path is a relative path.
 * A relative path must be non-empty, start with a single forward slash, and not start with a double slash.
 * For use in validating redirect paths to prevent open redirect vulnerabilities.
 *
 * @param path - The path string to check
 * @returns `true` if the path is a relative path, `false` otherwise
 *
 * @example
 * isRelativePath("/home/user") // true
 * isRelativePath("//network/path") // false
 * isRelativePath("") // false
 */
export const isRelativePath = (path: string): boolean => {
  return path.trim() !== "" && path.startsWith("/") && !path.startsWith("//");
};
