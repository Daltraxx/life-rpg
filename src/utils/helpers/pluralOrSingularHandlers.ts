/**
 * Adds an 's' suffix to a word if the count is greater than 1, otherwise returns the word unchanged.
 * Useful for pluralizing nouns based on a numeric count.
 *
 * @param word - The word to potentially pluralize
 * @param count - The numeric count to determine singular or plural form
 * @returns The word with 's' appended if count !== 1, otherwise the original word
 *
 * @example
 * addSIfPluralOrZero('apple', 1) // Returns 'apple'
 * addSIfPluralOrZero('apple', 2) // Returns 'apples'
 * addSIfPluralOrZero('item', 0) // Returns 'items'
 */
export const addSIfPluralOrZero = (word: string, count: number): string => {
  return count === 1 ? word : `${word}s`;
};

/**
 * Determines whether to use the singular verb "is" or plural verb "are" based on a count.
 * @param count - The number to evaluate for singular or plural form
 * @returns The string "is" if count equals 1, otherwise "are"
 * @example
 * getAreOrIs(1) // returns "is"
 * getAreOrIs(5) // returns "are"
 */
export const getAreOrIs = (count: number): string => {
  return count === 1 ? "is" : "are";
};

export const getNounAndVerbAgreement = (noun: string, count: number) => {
  const pluralNoun = addSIfPluralOrZero(noun, count);
  const verb = getAreOrIs(count);
  return `${pluralNoun} ${verb}`;
};
