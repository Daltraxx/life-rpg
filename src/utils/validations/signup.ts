import { z } from "zod";

// Further validation can be added here as needed
export const SignupSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
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