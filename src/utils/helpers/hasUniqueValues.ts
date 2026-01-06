/**
 * Ensures that all values for a specific key in an array of objects are unique.
 * String values are normalized by trimming whitespace and converting to lowercase before comparison.
 * @template T - The type of objects in the array, must be a record with string keys
 * @param array - The array of objects to check for uniqueness
 * @param key - The key of the property to check for uniqueness
 * @returns True if all values for the specified key are unique, false otherwise
 * @note For string values, comparison is case-insensitive and ignores leading/trailing whitespace
 * @note For non-string values, comparison is by reference, not by deep equality
 * @note null and undefined are treated as distinct values; multiple nulls or undefineds are considered duplicates
 * @note Empty arrays return true (vacuously, all zero values are unique)
 * @example
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' }
 * ];
 * hasUniqueValues(users, 'id'); // true
 *
 * const duplicates = [
 *   { id: 1, name: 'Alice' },
 *   { id: 1, name: 'Bob' }
 * ];
 * hasUniqueValues(duplicates, 'id'); // false
 *
 * const normalized = [
 *   { email: 'alice@example.com' },
 *   { email: ' ALICE@EXAMPLE.COM ' }
 * ];
 * hasUniqueValues(normalized, 'email'); // false (normalized to same value)
 */
export default function hasUniqueValues<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): boolean {
  const values = array.map((item) =>
    typeof item[key] === "string"
      ? (item[key] as string).trim().toLowerCase()
      : item[key]
  );
  return values.length === new Set(values).size;
}
