/**
 * Represents the state of a simple form action after submission or validation.
 *
 * @interface SimpleFormActionState
 *
 * @property {Record<string, string[]>} [errors] - A map of field names to their corresponding validation error messages.
 *           Each field can have multiple error messages associated with it.
 * @property {string} [message] - An optional message providing feedback about the form action result.
 * @property {boolean} [success] - An optional flag indicating whether the form action was successful.
 */
export interface SimpleFormActionState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}
