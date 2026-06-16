"use client";

import styles from "./styles.module.css";
import Bounded from "@/app/ui/JSXWrappers/Bounded";
import {
  ButtonWrapper,
  LinkWrapper,
} from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import { BasicLinkWrapper } from "@/app/ui/JSXWrappers/BasicLinkWrapper/BasicLinkWrapper";
import {
  Label,
  Paragraph,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { login } from "@/utils/actions/login";
import { useActionState } from "react";
import { LoginState } from "@/utils/validations/login";
import FieldErrorsDisplay from "@/app/ui/FieldErrorsDisplay";
import { ROUTES } from "@/utils/constants/routes";

const INITIAL_LOGIN_STATE: LoginState = {
  message: "",
  errors: {},
};

export default function LoginForm() {
  const [errorState, formAction, isPending] = useActionState(
    login,
    INITIAL_LOGIN_STATE,
  );
  return (
    <Bounded innerClassName={styles.loginContainer}>
      <form
        className={styles.loginForm}
        action={formAction}
        aria-describedby="login-error"
      >
        {/* EMAIL */}
        <Label htmlFor="email-field" size="20">
          Email:
        </Label>
        <input
          type="email"
          id="email-field"
          name="email"
          required
          autoComplete="email"
          aria-describedby="email-field-errors"
        />
        <FieldErrorsDisplay
          errors={errorState.errors?.email}
          id="email-field-errors"
          fontSize="16"
        />

        {/* PASSWORD */}
        <Label htmlFor="password-field" size="20">
          Password:
        </Label>
        <input
          type="password"
          id="password-field"
          name="password"
          required
          autoComplete="current-password"
          aria-describedby="password-field-errors"
        />
        <FieldErrorsDisplay
          errors={errorState.errors?.password}
          id="password-field-errors"
          fontSize="16"
        />

        {/* ERROR MESSAGE */}
        <div
          id="login-error"
          aria-live="polite"
          className={styles.errorMessage}
        >
          {errorState.message && (
            <Paragraph size="20" color="red-500">
              {errorState.message}
            </Paragraph>
          )}
        </div>

        {/* SUBMIT */}
        <ButtonWrapper
          type="submit"
          className={styles.loginButton}
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </ButtonWrapper>

        {/* FORGOT PASSWORD */}
        <BasicLinkWrapper
          href={ROUTES.FORGOT_PASSWORD}
          className={styles.forgotPasswordLink}
          fontSize="20"
        >
          Forgot Password?
        </BasicLinkWrapper>
      </form>
      <div className={styles.divider}></div>

      {/* CREATE ACCOUNT */}
      <LinkWrapper href={ROUTES.SIGNUP} className={styles.createAccountLink}>
        Create an account
      </LinkWrapper>
    </Bounded>
  );
}
