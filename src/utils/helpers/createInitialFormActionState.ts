import type { SimpleFormActionState } from "@/utils/types/formActionState";

/**
 * Creates an initial form action state object with empty errors and no message.
 *
 * @returns {Object} An object containing:
 * - `errors`: An empty object for storing form field errors
 * - `message`: A null value for status messages
 *
 * @example
 * const initialState = createSimpleInitialFormActionState();
 * // Returns: { errors: {}, message: null }
 */
export const createSimpleInitialFormActionState = (): SimpleFormActionState => {
  return {
    errors: {},
    message: null,
  };
};
