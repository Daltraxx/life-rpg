"use client";

import z from "zod";
import { useState, useEffect, useActionState } from "react";
import { createAccount } from "@/app/(account-creation)/actions";
import { SignupSchema, SignupState } from "@/utils/validations/signup";

import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import Text from "../../Text";
import styles from "./styles.module.css";

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

export default function CreateAccountForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ValidationErrorMessages>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const validatedFields = SignupSchema.safeParse(formData);
    if (!validatedFields.success) {
      setErrors(z.flattenError(validatedFields.error).fieldErrors);
    } else {
      setErrors({});
    }
  }, [formData]);

  const [errorState, formAction, isPending] = useActionState(
    createAccount,
    INITIAL_SIGNUP_STATE
  );

  return (
    <Bounded innerClassName={styles.contentContainer}>
      <div className={styles.headerContainer}>
        <Heading as="h1" size="48-responsive">
          Welcome {(formData.username && formData.username) || "[new user]"}!
        </Heading>
        <Text as="p" size="36-responsive" className={styles.subheading}>
          Please complete the following to set up your character profile...
        </Text>
      </div>

      <form className={styles.formContainer} action={formAction}>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby="email-error"
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
            aria-describedby="username-error"
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
            aria-describedby="password-error"
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
            aria-describedby="confirmPassword-error"
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
        {/* test below */}
        <div className={styles.serverErrorContainer} role="alert">
          {errorState.message && <p>{errorState.message}</p>}
        </div>

        <ButtonWrapper
          type="submit"
          color="blue-600"
          className={styles.submitButton}
          disabled={isPending}
        >
          Create Account!
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
