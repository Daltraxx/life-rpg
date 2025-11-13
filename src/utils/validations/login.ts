import { z } from "zod";

// Further validation can be added here as needed
export const LoginSchema = z.object({
  // NOTE: z.string().email() is deprecated in Zod v4, use z.email() instead
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};
