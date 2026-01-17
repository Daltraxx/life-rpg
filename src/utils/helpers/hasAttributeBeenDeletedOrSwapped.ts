/**
 * Determines if an attribute has been deleted or swapped between two sets.
 *
 * @param prevAttributes - The previous set of attributes to compare
 * @param newAttributes - The new set of attributes to compare
 * @returns `true` if any attribute was deleted (present in previous but not in new) or if the total count decreased; `false` otherwise
 *
 * @example
 * const prev = new Set(['name', 'age', 'email']);
 * const next = new Set(['name', 'age']);
 * hasAttributeBeenDeletedOrSwapped(prev, next); // returns true
 */
const hasAttributeBeenDeletedOrSwapped = (
  prevAttributes: Set<string>,
  newAttributes: Set<string>
) => {
  if (prevAttributes.size > newAttributes.size) {
    return true;
  }
  for (let attr of prevAttributes) {
    if (!newAttributes.has(attr)) {
      return true;
    }
  }
  return false;
};

export default hasAttributeBeenDeletedOrSwapped;
