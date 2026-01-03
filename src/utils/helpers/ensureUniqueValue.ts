/**
 * Ensures that all values for a specific key in an array of objects are unique.
 * @template T - The type of objects in the array, must be a record with string keys
 * @param array - The array of objects to check for uniqueness
 * @param key - The key of the property to check for uniqueness
 * @returns True if all values for the specified key are unique, false otherwise
 * @example
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' }
 * ];
 * ensureUniqueValue(users, 'id'); // true
 * 
 * const duplicates = [
 *   { id: 1, name: 'Alice' },
 *   { id: 1, name: 'Bob' }
 * ];
 * ensureUniqueValue(duplicates, 'id'); // false
 */
export default function ensureUniqueValue<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): boolean {
  const values = array.map((item) => item[key]);
  return values.length === new Set(values).size;
}
