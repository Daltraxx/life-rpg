"use client";

import { useState, useActionState, useRef, ReactElement } from "react";
import { createAccount } from "@/app/(account-creation)/actions";
import { SignupState } from "@/utils/validations/signup";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label, Paragraph, Span } from "@/app/ui/JSXWrappers/TextWrappers";
import FieldErrorsDisplay from "@/app/ui/FieldErrorsDisplay";
import styles from "./styles.module.css";
import useTruncatedString from "@/utils/hooks/useTruncatedString";
import useSignupValidation, {
  ValidationErrorMessages,
} from "@/utils/hooks/useSignupValidation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const INITIAL_SIGNUP_STATE: SignupState = {
  errors: {},
  message: null,
};

type Field = keyof ValidationErrorMessages;

export const FIELDS: Field[] = ["email", "username", "usertag", "password"];
export type InteractedFields = Record<Field, boolean>;
export const INITIAL_INTERACTED_FIELDS: InteractedFields = Object.fromEntries(
  FIELDS.map((field) => [field, false])
) as InteractedFields;

export type SignupFormData = {
  email: string;
  username: string;
  usertag: string;
  password: string;
};
export const INITIAL_FORM_DATA: SignupFormData = {
  email: "",
  username: "",
  usertag: "",
  password: "",
};

const getSubmitButtonText = (
  querying: boolean,
  allFieldsValid: boolean,
  isPending: boolean
): string => {
  if (querying) return "Checking availability...";
  if (!allFieldsValid) return "Waiting Patiently...";
  if (isPending) return "Creating Account...";
  return "Create Account!";
};

const HEADING_FONT_FAMILY = "Jersey 10";
const USERNAME_PLACEHOLDER = "[new user]";
const MAX_HEADING_WIDTH_RATIO = 0.95; // 95% of window width

/**
 * CreateAccountForm component for user registration.
 *
 * Renders a form with email, username, usertag, and password  fields.
 * Includes real-time validation, username availability checking, and dynamic
 * username display with text truncation to prevent layout overflow.
 *
 * @returns {ReactElement} A bounded form container with input fields, validation errors,
 * and a submit button for account creation.
 *
 * @remarks
 * - The username in the heading is dynamically truncated based on viewport size
 * - Form validation occurs as users interact with fields
 * - Usertag availability is checked asynchronously during input
 * - Submit button is disabled during validation, querying, or form submission
 * - Server-side errors are displayed below the form fields
 * - All form fields are required and include appropriate accessibility attributes
 *
 * @example
 * ```tsx
 * <CreateAccountForm />
 * ```
 */
export default function CreateAccountForm(): ReactElement {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [interactedFields, setInteractedFields] = useState(
    INITIAL_INTERACTED_FIELDS
  );

  const [showPassword, setShowPassword] = useState(false);
  const passwordIcon = showPassword ? faEyeSlash : faEye;
  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setInteractedFields((prev) => ({ ...prev, [target.name]: true }));
    setFormData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const { errors, allFieldsValid, querying } = useSignupValidation(
    formData,
    interactedFields
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

  const [errorState, formAction, isPending] = useActionState(
    createAccount,
    INITIAL_SIGNUP_STATE
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
          <FieldErrorsDisplay
            errors={errors.username}
            id="username-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        {/*Autocomplete off to prevent browser overwriting during password autofill (google specifically) */}
        <div className={styles.inputContainer}>
          <Label htmlFor="handle" size="24-responsive">
            User Tag:
          </Label>
          <input
            id="usertag"
            type="text"
            name="usertag"
            autoComplete="off"
            value={formData.usertag}
            onChange={handleChange}
            aria-describedby={errors.usertag ? "usertag-error" : undefined}
            required
          />
          {querying && (
            <Span
              className={styles.loadingIndicator}
              size="24-responsive"
              aria-live="polite"
            >
              Checking availability...
            </Span>
          )}
          <FieldErrorsDisplay
            errors={errors.usertag}
            id="handle-error"
            fontSize="20-responsive"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="password" size="24-responsive">
            Password:
          </Label>
          <div className={styles.passwordInputContainer}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            <button
              type="button"
              className={styles.passwordToggleButton}
              onClick={handlePasswordToggle}
            >
              <FontAwesomeIcon
                icon={passwordIcon}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              />
            </button>
          </div>
          <FieldErrorsDisplay
            errors={errors.password}
            id="password-error"
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
          {getSubmitButtonText(querying, allFieldsValid, isPending)}
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
