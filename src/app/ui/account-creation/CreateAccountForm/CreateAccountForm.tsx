"use client";

import { z } from "zod";
import { useState, useEffect, useActionState, ReactNode, useRef } from "react";
import { createAccount } from "@/app/(account-creation)/actions";
import { SignupSchema, SignupState } from "@/utils/validations/signup";

import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import { Label, Paragraph } from "../../TextWrappers";
import styles from "./styles.module.css";
import useTruncatedString from "@/utils/hooks/useTruncatedString";

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
    Object.fromEntries(FIELDS.map((field) => [field, false])) as Record<
      Field,
      boolean
    >
  );

  const [errors, setErrors] = useState<ValidationErrorMessages>({});

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setInteractedFields((prev) => ({ ...prev, [target.name]: true }));
    setFormData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  // State to track if all fields are valid, controls submit button disabled state
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  /**
   * A React effect that validates the form data with debouncing whenever it changes.
   * It uses a 500ms debounce delay to prevent excessive validation calls during rapid typing.
   * The effect validates using `SignupSchema` and updates the `errors` state with validation
   * errors only for fields that have been interacted with.
   *
   * If the validation is successful, it clears the errors.
   *
   * Dependencies:
   * - `formData`: The current state of the form data.
   *
   * Side Effects:
   * - Updates the `errors` state based on the validation results after the debounce delay.
   * - Clears pending validation timeouts on cleanup to prevent memory leaks.
   */
  useEffect(() => {
    const validationHandler = setTimeout(() => {
      const validatedFields = SignupSchema.safeParse(formData);
      console.log("Validating form data:", formData, validatedFields);
      if (!validatedFields.success) {
        const errors = z.flattenError(validatedFields.error).fieldErrors;
        const filteredErrors: ValidationErrorMessages = {};
        for (const field of FIELDS) {
          if (interactedFields[field] && errors[field]?.length)
            filteredErrors[field] = errors[field];
        }
        setErrors(filteredErrors);
        setAllFieldsValid(false);
      } else {
        setErrors({});
        setAllFieldsValid(true);
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
    "[new user]",
    "Jersey 10"
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
          {errors.email && (
            <div
              id="email-error"
              className={styles.errorMessage}
              aria-live="polite"
            >
              {errors.email.map((error) => (
                <Paragraph key={error} size="20-responsive">
                  - {error}
                </Paragraph>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="username" size="24-responsive">
            Display Name:
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
          {errors.username && (
            <div
              id="username-error"
              className={styles.errorMessage}
              aria-live="polite"
            >
              {errors.username.map((error) => (
                <Paragraph key={error} size="20-responsive">
                  - {error}
                </Paragraph>
              ))}
            </div>
          )}
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
          {errors.password && (
            <div
              id="password-error"
              className={styles.errorMessage}
              aria-live="polite"
            >
              {errors.password.map((error) => (
                <Paragraph key={error} size="20-responsive">
                  - {error}
                </Paragraph>
              ))}
            </div>
          )}
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
          {errors.confirmPassword && (
            <div
              id="confirmPassword-error"
              className={styles.errorMessage}
              aria-live="polite"
            >
              {errors.confirmPassword.map((error) => (
                <Paragraph key={error} size="20-responsive">
                  - {error}
                </Paragraph>
              ))}
            </div>
          )}
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
          disabled={isPending || !allFieldsValid}
        >
          {isPending ? "Creating Account..." : "Create Account!"}
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
