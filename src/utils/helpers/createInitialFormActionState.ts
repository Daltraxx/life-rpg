import type { SimpleFormActionState } from "@/utils/types/formActionState";

/**
 * Creates an initial form action state object with empty errors and no message field set.
 *
 * @returns {Object} An object containing:
 * - `errors`: An empty object for storing form field errors
 *
 * @example
 * const initialState = createSimpleInitialFormActionState();
 * // Returns: { errors: {} }
 */
export const createSimpleInitialFormActionState = (): SimpleFormActionState => {
  return {
    errors: {},
  };
};
