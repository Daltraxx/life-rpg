/**
 * Centralized route definitions for the application.
 *
 * This module exports a constant object `ROUTES` that contains all the route paths used throughout the application.
 */

export const ROUTES = {
  HOME: "/",
  SIGNUP: "/create-account",
  VERIFY_EMAIL: "/verify-email",
  PROFILE: "/profile",
  CREATE_PROFILE: "/create-profile",
  EDIT_PROFILE: "/edit-profile",
  MANUAL: "/manual",
  ERROR: "/error",
  AUTH: "/auth",
  AUTH_CONFIRM_EMAIL: "/auth/confirm",
  AUTH_SIGNOUT: "/auth/signout",
  FORGOT_PASSWORD: "/forgot-password",
} as const;