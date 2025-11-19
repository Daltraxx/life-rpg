"use client";

import { z } from "zod";
import { useState, useEffect, useActionState, ReactNode, useRef } from "react";
import { createAccount } from "@/app/(account-creation)/actions";
import { SignupSchema, SignupState } from "@/utils/validations/signup";

import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import { Label, Paragraph } from "../../TextWrappers";
import FieldErrorsDisplay from "@/app/ui/FieldErrorsDisplay";
import styles from "./styles.module.css";
import useTruncatedString from "@/utils/hooks/useTruncatedString";
import checkIfUsernameExists from "@/app/queries/client/checkIfUsernameExists";

const INITIAL_SIGNUP_STATE: SignupState = {
  errors: {},
  message: null,
};

type ValidationErrorMessages = {
  email?: string[];
  username?: string[];
  password?: string[];
  confirmPassword?: string[];
};

type Field = keyof ValidationErrorMessages;

const FIELDS: Field[] = ["email", "username", "password", "confirmPassword"];

const interactedFieldsInitialState: Record<Field, boolean> = Object.fromEntries(
  FIELDS.map((field) => [field, false])
) as Record<Field, boolean>;

const HEADING_FONT_FAMILY = "Jersey 10";
const USERNAME_PLACEHOLDER = "[new user]";
const MAX_HEADING_WIDTH_RATIO = 0.95; // 95% of window width

/**
 * CreateAccountForm - A form component for creating new user accounts.
 *
 * This component provides a multi-field registration form with real-time validation,
 * field-level error messaging, and server-side action handling. It includes:
 * - Email, username, password, and password confirmation fields
 * - Client-side validation using Zod schema (SignupSchema)
 * - Field interaction tracking to show errors only after user interaction
 * - Server-side validation and error handling via useActionState
 * - Accessible error messages with ARIA attributes
 * - Disabled submit state during pending operations
 * - Dynamic welcome message using entered username or placeholder
 *
 * @component
 * @returns {ReactNode} A bounded form container with input fields, validation errors,
 * and a submit button for account creation.
 *
 * @example
 * ```tsx
 * <CreateAccountForm />
 * ```
 */
export default function CreateAccountForm(): ReactNode {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [interactedFields, setInteractedFields] = useState(
    interactedFieldsInitialState
  );

  const [errors, setErrors] = useState<ValidationErrorMessages>({});

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setInteractedFields((prev) => ({ ...prev, [target.name]: true }));
    setFormData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  // State to track if all fields are valid, controls submit button disabled state
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const [querying, setQuerying] = useState(false);
  const prevUsernameRef = useRef<string>("");
  const usernameCheckRequestIdRef = useRef<number>(0);
  // TODO: extract into a custom hook?
  useEffect(() => {
    /**
     * Validation handler that performs field validation and username availability checking.
     *
     * This handler is debounced with a 500ms delay to avoid excessive validation calls.
     * It performs the following operations:
     *
     * 1. Validates form data against the SignupSchema using Zod
     * 2. Filters validation errors to only show errors for fields the user has interacted with
     * 3. Checks username availability against the backend if the username field is valid and has been modified
     * 4. Updates error state and form validity state based on validation results
     *
     * The username availability check includes:
     * - Request ID tracking to prevent race conditions from outdated requests
     * - Comparison with previous username to avoid redundant checks
     * - Loading state management via setQuerying
     * - Error handling for network failures
     *
     * @remarks
     * The handler uses a request ID system to ensure that only the most recent username check
     * result is applied, preventing race conditions when the user types quickly.
     *
     * @see {@link SignupSchema} - The Zod schema used for validation
     * @see {@link checkIfUsernameExists} - The async function that checks username availability
     */
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
      const currentUsernameCheckRequestId = ++usernameCheckRequestIdRef.current;
      if (
        usernameValid &&
        interactedFields.username &&
        username !== prevUsernameRef.current
      ) {
        setQuerying(true);
        try {
          const exists = await checkIfUsernameExists(username);
          if (
            currentUsernameCheckRequestId !== usernameCheckRequestIdRef.current
          )
            return; // Outdated request, ignore result

          prevUsernameRef.current = username;
          // TODO: consider caching results to avoid re-checking same usernames
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

  const [errorState, formAction, isPending] = useActionState(
    createAccount,
    INITIAL_SIGNUP_STATE
  );

  // Dynamic username display logic designed to prevent layout overflow
  const headingElementRef = useRef<HTMLHeadingElement>(null);
  const usernameForDisplay = useTruncatedString(
    formData.username,
    headingElementRef,
    MAX_HEADING_WIDTH_RATIO,
    USERNAME_PLACEHOLDER,
    HEADING_FONT_FAMILY,
    36,
    48
  );

  return (
    <Bounded
      outerClassName={styles.outerContainer}
      innerClassName={styles.contentContainer}
    >
      <div className={styles.headerContainer}>
        <Heading
          as="h1"
          size="48-responsive"
          ref={headingElementRef}
          className={styles.heading}
        >
          Welcome {usernameForDisplay}!
        </Heading>
        <Paragraph size="36-responsive" className={styles.subheading}>
          Please complete the following to set up your character profile...
        </Paragraph>
      </div>

      <form
        className={styles.formContainer}
        action={formAction}
        aria-describedby={errorState.message ? "server-error" : undefined}
      >
        <div className={styles.inputContainer}>
          <Label htmlFor="email" size="24-responsive">
            Email:
          </Label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          <FieldErrorsDisplay
            errors={errors.email}
            id="email-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="username" size="24-responsive">
            Display Name:{" "}
          </Label>
          <input
            id="username"
            type="text"
            name="username"
            // consider autoComplete="username", problem is it autofills with email
            value={formData.username}
            onChange={handleChange}
            aria-describedby={errors.username ? "username-error" : undefined}
            required
          />
          {/* TODO: style loading indicator */}
          {querying && (
            <span className={styles.loadingIndicator}>Checking availability...</span>
          )}
          <FieldErrorsDisplay
            errors={errors.username}
            id="username-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="password" size="24-responsive">
            Password:
          </Label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            aria-describedby={errors.password ? "password-error" : undefined}
            required
          />
          <FieldErrorsDisplay
            errors={errors.password}
            id="password-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="confirmPassword" size="24-responsive">
            Confirm Password:
          </Label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            required
          />
          <FieldErrorsDisplay
            errors={errors.confirmPassword}
            id="confirmPassword-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        {/* TODO: test below error messaging*/}
        {errorState.message && (
          <div
            id="server-error"
            className={styles.serverErrorContainer}
            role="alert"
          >
            <Paragraph size="20-responsive">{errorState.message}</Paragraph>
          </div>
        )}

        <ButtonWrapper
          type="submit"
          color="blue-600"
          className={styles.submitButton}
          disabled={isPending || !allFieldsValid || querying}
        >
          {!allFieldsValid && "Waiting Patiently..." || (isPending ? "Creating Account..." : "Create Account!")}
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
