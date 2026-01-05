import { z } from "zod";

// TODO: Further refine schema (e.g., restrict names to certain characters)
export const AttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name cannot be empty")
    .max(30, "Attribute name cannot exceed 30 characters"),
  order: z.int("Order must be an integer").nonnegative("Order must be a non-negative integer"),
});

export type Attribute = z.infer<typeof AttributeSchema>;
