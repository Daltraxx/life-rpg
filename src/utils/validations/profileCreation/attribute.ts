import { z } from "zod";
import { MAX_ATTRIBUTES_ALLOWED } from "@/app/ui/utils/constants/gameConstants";

// TODO: Further refine schema (e.g., restrict names to certain characters)
export const AttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name cannot be empty")
    .max(30, "Attribute name cannot exceed 30 characters"),
  order: z
    .int("Order must be an integer")
    .nonnegative("Order must be a non-negative integer")
    .max(
      MAX_ATTRIBUTES_ALLOWED - 1,
      `Order must be less than ${MAX_ATTRIBUTES_ALLOWED}`
    ),
});

export type Attribute = z.infer<typeof AttributeSchema>;
