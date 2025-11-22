import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { SignupSchema } from "@/utils/validations/signup";
import checkIfUsernameExists from "@/app/queries/client/checkIfUsernameExists";
import {
  FIELDS,
  type InteractedFields,
  type FormData,
} from "@/app/ui/account-creation/CreateAccountForm/CreateAccountForm";

export type ValidationErrorMessages = {
  email?: string[];
  username?: string[];
  password?: string[];
  confirmPassword?: string[];
};

/**
 * Validates sign-up form data and returns field error messages, overall validity, and async status.
 *
 * This custom React hook performs:
 * - Debounced client-side validation (~500 ms) against a schema.
 * - Error reporting only for fields the user has interacted with.
 * - An asynchronous username-availability check with:
 *   - Result caching per username value.
 *   - Request de-duping and out-of-order (stale) response protection.
 *   - A querying flag while the availability check is in-flight.
 *   - Uses AbortController to cancel in-flight username requests on unmount or dependency change.
 *   - Passes the AbortController signal to `checkIfUsernameExists` for proper cancellation.
 *
 * The username availability check only runs when:
 * - The username passes local (schema) validation,
 * - The user has interacted with the username field, and
 * - The value differs from the last successfully checked username.
 *
 * The debounce timer is cleared and any in-flight username check is aborted on dependency changes and unmount to avoid
 * leaking work or updating state after unmount. Stale async results are ignored to prevent overwriting newer state.
 *
 * @param formData - The current values for the sign-up form fields.
 * @param interactedFields - A map of field names to booleans indicating which fields the user has interacted with; errors are only surfaced for these fields.
 *
 * @returns An object containing:
 * - errors: A map of field names to arrays of validation messages for fields that are invalid and have been interacted with.
 * - allFieldsValid: True when all fields pass client-side validation and the username (if applicable) is available.
 * - querying: True while the asynchronous username availability check is in progress.
 *
 * @example
 * const { errors, allFieldsValid, querying } = useSignupValidation(formData, interacted);
 * // Disable submit while invalid or while username availability is being checked
 * <button disabled={!allFieldsValid || querying}>Create account</button>
 * {errors.username && <p role="alert">{errors.username[0]}</p>}
 *
 * @remarks
 * - Errors are cleared when all fields pass schema validation.
 * - If the username is already taken, an error is added and `allFieldsValid` is set to false.
 * - Cached username checks are reused to reduce unnecessary network requests.
 * - Username availability requests are properly aborted on unmount or when dependencies change.
 */
export default function useSignupValidation(
  formData: FormData,
  interactedFields: InteractedFields,
  debounceDelay = 500
): {
  errors: ValidationErrorMessages;
  allFieldsValid: boolean;
  querying: boolean;
} {
  const [errors, setErrors] = useState<ValidationErrorMessages>({});
  // State to track if all fields are valid, controls submit button disabled state
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const [querying, setQuerying] = useState(false);
  const usernameCheckRequestIdRef = useRef<number>(0);
  // TODO: Consider adding a cache eviction strategy (LRU cache) if this map could grow large
  const checkedUsernamesRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    const abortController = new AbortController();
    const validationHandler = setTimeout(async () => {
      const validatedFields = SignupSchema.safeParse(formData);
      let usernameValid = true;

      if (!validatedFields.success) {
        const errors = z.flattenError(validatedFields.error).fieldErrors;
        const filteredErrors: ValidationErrorMessages = {};
        for (const field of FIELDS) {
          if (interactedFields[field] && errors[field]?.length) {
            filteredErrors[field] = errors[field];
            if (field === "username") usernameValid = false;
          }
        }
        setErrors(filteredErrors);
        setAllFieldsValid(false);
      } else {
        setErrors({});
        setAllFieldsValid(true);
      }

      // Additional check for username existence
      const username = formData.username;
      const usernameExistsCached = checkedUsernamesRef.current.get(username);
      if (usernameExistsCached !== undefined) {
        // Use cached result
        if (usernameExistsCached) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: ["Username already taken"],
          }));
          setAllFieldsValid(false);
          return;
        } else {
          return; // Username is available, no further action needed
        }
      }
      if (usernameValid && interactedFields.username) {
        const currentUsernameCheckRequestId =
          ++usernameCheckRequestIdRef.current;
        setQuerying(true);
        try {
          const exists = await checkIfUsernameExists(
            username,
            abortController.signal
          );
          checkedUsernamesRef.current.set(username, exists);
          if (
            currentUsernameCheckRequestId !== usernameCheckRequestIdRef.current
          )
            return; // Outdated request, ignore result

          if (exists) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: ["Username already taken"],
            }));
            setAllFieldsValid(false);
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return; // Request was aborted, ignore
          console.error("Error checking username existence:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: [
              "Error checking username availability, please try again",
            ],
          }));
          setAllFieldsValid(false);
        } finally {
          setQuerying(false);
        }
      }
    }, debounceDelay); // Adjust the delay as needed

    return () => {
      clearTimeout(validationHandler); // Cleanup the timeout on unmount or when formData changes
      abortController.abort(); // Abort any in-flight username check on cleanup
    };
  }, [formData, interactedFields]);

  return { errors, allFieldsValid, querying };
}
