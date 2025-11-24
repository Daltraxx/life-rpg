import { z } from "zod";

// Further validation can be added here as needed
export const SignupSchema = z
  .object({
    email: z.email("Invalid email address"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .regex(
        /^[A-Za-z0-9_ ]+$/,
        "Username can only contain letters, numbers, underscores, and spaces"
    ),
    usertag: z.string()
      .trim()
      .toLowerCase()
      .min(3, "User Tag must be at least 3 characters long")
      .max(30, "User Tag must be at most 30 characters long")
      .regex(
        /^[A-Za-z0-9_]+$/,
        "User Tag can only contain letters, numbers, and underscores"
    ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be at most 100 characters long")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_+=~`<>,.;:'"()\[\]{}\\|/-]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupState = {
  errors?: {
    email?: string[];
    username?: string[];
    usertag?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};
