import { z } from "zod";

// NOTE: z.string().email() is deprecated in Zod v4, use z.email() instead
export const EmailSchema = z.email("Invalid email address");