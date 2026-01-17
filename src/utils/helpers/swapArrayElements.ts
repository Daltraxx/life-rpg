/**
 * Swaps two elements in an array at the specified indices.
 * Returns a new array with the elements swapped, leaving the original array unchanged.
 *
 * @template T - The type of elements in the array
 * @param array - The array containing the elements to swap
 * @param indexA - The index of the first element to swap
 * @param indexB - The index of the second element to swap
 * @returns A new array with the elements at indexA and indexB swapped
 * @throws {RangeError} If either indexA or indexB is out of bounds for the array
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5];
 * const result = swapArrayElements(numbers, 0, 4);
 * // result: [5, 2, 3, 4, 1]
 * ```
 */
const swapArrayElements = <T>(
  array: T[],
  indexA: number,
  indexB: number
): T[] => {
  if (
    indexA < 0 ||
    indexB < 0 ||
    indexA >= array.length ||
    indexB >= array.length
  ) {
    throw new RangeError(
      `Indices out of bounds: indexA=${indexA}, indexB=${indexB}, array length=${array.length}`
    );
  }
  const newArray = [...array];
  [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]];
  return newArray;
};

export default swapArrayElements;
