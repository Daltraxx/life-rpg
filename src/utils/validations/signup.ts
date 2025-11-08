import { z } from "zod";

// Further validation can be added here as needed
export const SignupSchema = z
  .object({
    email: z.email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be at most 100 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be at most 100 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupState = {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};
