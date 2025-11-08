"use client";

import { z } from "zod";
import { useState, useEffect, useActionState, ReactNode, useRef } from "react";
import { createAccount } from "@/app/(account-creation)/actions";
import { SignupSchema, SignupState } from "@/utils/validations/signup";

import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import { Paragraph } from "../../Text";
import styles from "./styles.module.css";
import useWindowWidth from "@/utils/hooks/useWindowWidth";
import useElementWidth from "@/utils/hooks/useElementWidth";

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

  const fields: Field[] = ["email", "username", "password", "confirmPassword"];
  const initialInteractedFields: Record<Field, boolean> = {
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  };

  const [interactedFields, setInteractedFields] = useState(
    initialInteractedFields
  );

  const [errors, setErrors] = useState<ValidationErrorMessages>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInteractedFields((prev) => ({ ...prev, [e.target.name]: true }));
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      if (!validatedFields.success) {
        const errors = z.flattenError(validatedFields.error).fieldErrors;
        const filteredErrors: ValidationErrorMessages = {};
        for (const field of fields) {
          if (interactedFields[field] && errors[field as Field]?.length)
            filteredErrors[field as Field] = errors[field as Field];
        }
        setErrors(filteredErrors);
      } else {
        setErrors({});
      }
    }, 500); // Adjust the delay as needed (500ms in this example)

    return () => {
      clearTimeout(validationHandler); // Cleanup the timeout on unmount or when formData changes
    };
  }, [formData, interactedFields]);

  const [errorState, formAction, isPending] = useActionState(
    createAccount,
    INITIAL_SIGNUP_STATE
  );

  // Dynamic username display logic designed to prevent layout overflow
  const windowWidth = useWindowWidth();
  const headingElementRef = useRef<HTMLHeadingElement>(null);
  const headingWidth = useElementWidth(headingElementRef, formData.username);
  const [usernameForDisplay, setUsernameForDisplay] = useState(formData.username || "[new user]");
  useEffect(() => {
    // console.log("Heading width:", headingWidth, "Window width:", windowWidth);
    if (formData.username.length > 18 && headingWidth > windowWidth * 0.85) {
      setUsernameForDisplay(formData.username.slice(0, 18) + "...");
    } else {
      setUsernameForDisplay(formData.username || "[new user]");
    }
  }, [formData.username, headingWidth, windowWidth]);

  const testRef = useRef<HTMLParagraphElement>(null);

  return (
    <Bounded innerClassName={styles.contentContainer}>
      <div className={styles.headerContainer}>
        <Heading as="h1" size="48-responsive" ref={headingElementRef} className={styles.heading}>
          Welcome {usernameForDisplay}!
        </Heading>
        <Paragraph size="36-responsive" className={styles.subheading} ref={testRef}>
          Please complete the following to set up your character profile...
        </Paragraph>
      </div>

      <form
        className={styles.formContainer}
        action={formAction}
        aria-describedby={errorState.message ? "server-error" : undefined}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email:</label>
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
            <div id="email-error" className={styles.errorMessage}>
              {errors.email.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="username">Display Name:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            aria-describedby={errors.username ? "username-error" : undefined}
            required
          />
          {errors.username && (
            <div id="username-error" className={styles.errorMessage}>
              {errors.username.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Password:</label>
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
            <div id="password-error" className={styles.errorMessage}>
              {errors.password.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
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
            <div id="confirmPassword-error" className={styles.errorMessage}>
              {errors.confirmPassword.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* remember to test below error messaging*/}
        {errorState.message && (
          <div
            id="server-error"
            className={styles.serverErrorContainer}
            role="alert"
          >
            <p>{errorState.message}</p>
          </div>
        )}

        <ButtonWrapper
          type="submit"
          color="blue-600"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating Account..." : "Create Account!"}
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
