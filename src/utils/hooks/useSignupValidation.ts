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

export default function useSignupValidation(
  formData: FormData,
  interactedFields: InteractedFields
): {
  errors: ValidationErrorMessages;
  allFieldsValid: boolean;
  querying: boolean;
} {
  const [errors, setErrors] = useState<ValidationErrorMessages>({});
  // State to track if all fields are valid, controls submit button disabled state
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const [querying, setQuerying] = useState(false);
  const prevUsernameRef = useRef<string>("");
  const usernameCheckRequestIdRef = useRef<number>(0);
  const [checkedUsernames, setCheckedUsernames] = useState<
    Map<string, boolean>
  >(new Map());

  useEffect(() => {
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
      const usernameExistsCached = checkedUsernames.get(username);
      if (usernameExistsCached !== undefined) {
        // Use cached result
        if (usernameExistsCached) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: ["Username already taken"],
          }));
        } else {
          return; // Username is available, no further action needed
        }
      }
      const currentUsernameCheckRequestId = ++usernameCheckRequestIdRef.current;
      if (
        usernameValid &&
        interactedFields.username &&
        username !== prevUsernameRef.current
      ) {
        setQuerying(true);
        try {
          const exists = await checkIfUsernameExists(username);
          setCheckedUsernames((prev) => new Map(prev).set(username, exists));
          if (
            currentUsernameCheckRequestId !== usernameCheckRequestIdRef.current
          )
            return; // Outdated request, ignore result

          prevUsernameRef.current = username;
          if (exists) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: ["Username already taken"],
            }));
            setAllFieldsValid(false);
          }
        } catch (error) {
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
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(validationHandler); // Cleanup the timeout on unmount or when formData changes
    };
  }, [formData, interactedFields]);

  return { errors, allFieldsValid, querying };
}
