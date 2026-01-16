import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { SignupSchema } from "@/utils/validations/signup";
import checkIfUsertagExists from "@/app/queries/client/checkIfUsertagExists";
import {
  FIELDS,
  type InteractedFields,
  type SignupFormData,
} from "@/app/ui/account-creation/CreateAccountForm/CreateAccountForm";

export type ValidationErrorMessages = {
  email?: string[];
  username?: string[];
  usertag?: string[];
  password?: string[];
};

/**
 * Validates sign-up form data and returns field error messages, overall validity, and async status.
 *
 * This custom React hook performs:
 * - Debounced client-side validation (~500 ms) against a schema.
 * - Error reporting only for fields the user has interacted with.
 * - An asynchronous usertag-availability check with:
 *   - Result caching per usertag value.
 *   - Request de-duping and out-of-order (stale) response protection.
 *   - A querying flag while the availability check is in-flight.
 *   - Uses AbortController to cancel in-flight usertag requests on unmount or dependency change.
 *   - Passes the AbortController signal to `checkIfUsertagExists` for proper cancellation.
 *
 * The usertag availability check only runs when:
 * - The usertag passes local (schema) validation,
 * - The user has interacted with the usertag field, and
 * - The value differs from the last successfully checked usertag.
 *
 * The debounce timer is cleared and any in-flight usertag check is aborted on dependency changes and unmount to avoid
 * leaking work or updating state after unmount. Stale async results are ignored to prevent overwriting newer state.
 *
 * @param SignupFormData - The current values for the sign-up form fields.
 * @param interactedFields - A map of field names to booleans indicating which fields the user has interacted with; errors are only surfaced for these fields.
 *
 * @returns An object containing:
 * - errors: A map of field names to arrays of validation messages for fields that are invalid and have been interacted with.
 * - allFieldsValid: True when all fields pass client-side validation and the usertag (if applicable) is available.
 * - querying: True while the asynchronous usertag availability check is in progress.
 *
 * @example
 * const { errors, allFieldsValid, querying } = useSignupValidation(formData, interacted);
 * // Disable submit while invalid or while usertag availability is being checked
 * <button disabled={!allFieldsValid || querying}>Create account</button>
 * {errors.usertag && <p role="alert">{errors.usertag[0]}</p>}
 *
 * @remarks
 * - Errors are cleared when all fields pass schema validation.
 * - If the usertag is already taken, an error is added and `allFieldsValid` is set to false.
 * - Cached usertag checks are reused to reduce unnecessary network requests.
 * - usertag availability requests are properly aborted on unmount or when dependencies change.
 */
export default function useSignupValidation(
  formData: SignupFormData,
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
  const usertagRequestIdRef = useRef<number>(0);
  // TODO: Consider adding a cache eviction strategy (LRU cache) if this map could grow large
  const checkedUsertagsRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    const abortController = new AbortController();
    const validationHandler = setTimeout(async () => {
      const validatedFields = SignupSchema.safeParse(formData);
      let usertagValid = true;

      if (!validatedFields.success) {
        const errors = z.flattenError(validatedFields.error).fieldErrors;
        const filteredErrors: ValidationErrorMessages = {};
        for (const field of FIELDS) {
          if (interactedFields[field] && errors[field]?.length) {
            filteredErrors[field] = errors[field];
            if (field === "usertag") usertagValid = false;
          }
        }
        setErrors(filteredErrors);
        setAllFieldsValid(false);
      } else {
        setErrors({});
        setAllFieldsValid(true);
      }

      // Additional check for usertag existence
      const usertag = formData.usertag;
      const usertagExistsCached = checkedUsertagsRef.current.get(usertag);
      if (usertagExistsCached !== undefined && interactedFields.usertag) {
        // Use cached result
        if (usertagExistsCached) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            usertag: ["User Tag already taken"],
          }));
          setAllFieldsValid(false);
          return;
        } else {
          return; // User Tag is available, no further action needed
        }
      }
      if (usertagValid && interactedFields.usertag) {
        const currentUsertagCheckRequestId =
          ++usertagRequestIdRef.current;
        setQuerying(true);
        try {
          const exists = await checkIfUsertagExists(
            usertag,
            abortController.signal
          );
          checkedUsertagsRef.current.set(usertag, exists);
          if (
            currentUsertagCheckRequestId !== usertagRequestIdRef.current
          )
            return; // Outdated request, ignore result

          if (exists) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              usertag: ["User Tag already taken"],
            }));
            setAllFieldsValid(false);
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return; // Request was aborted, ignore
          console.error("Error checking usertag existence:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            usertag: [
              "Error checking User Tag availability, please try again",
            ],
          }));
          setAllFieldsValid(false);
        } finally {
          if (
            currentUsertagCheckRequestId === usertagRequestIdRef.current
          )
            setQuerying(false);
        }
      }
    }, debounceDelay);

    return () => {
      clearTimeout(validationHandler); // Cleanup the timeout on unmount or when formData changes
      abortController.abort(); // Abort any in-flight username check on cleanup
    };
  }, [formData, interactedFields, debounceDelay]);

  return { errors, allFieldsValid, querying };
}
