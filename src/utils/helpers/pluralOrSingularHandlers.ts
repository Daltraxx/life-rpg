// Consider library like 'pluralize' for more complex pluralization needs in the future

/**
 * Adds an 's' suffix to a word if the count is not equal to 1, otherwise returns the word unchanged.
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
  if (!word || typeof word !== "string") {
    throw new Error("Word must be a non-empty string");
  }
  if (!Number.isFinite(count) || count < 0) {
    throw new Error('Count must be a non-negative finite number');
  }
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
  if (!Number.isFinite(count) || count < 0) {
    throw new Error("Count must be a non-negative finite number");
  }
  return count === 1 ? "is" : "are";
};

/**
 * Gets the grammatically correct noun and verb agreement for a given count.
 * @param noun - The base noun to pluralize if necessary
 * @param count - The number used to determine if the noun should be plural and which verb form to use
 * @returns A string containing the pluralized noun (if count is not 1) and the correct verb form (is/are)
 * @example
 * getNounAndVerbAgreement('cat', 1) // returns "cat is"
 * getNounAndVerbAgreement('cat', 2) // returns "cats are"
 * getNounAndVerbAgreement('cat', 0) // returns "cats are"
 */
export const getNounAndVerbAgreement = (
  noun: string,
  count: number
): string => {
  const pluralNoun = addSIfPluralOrZero(noun, count);
  const verb = getAreOrIs(count);
  return `${pluralNoun} ${verb}`;
};
