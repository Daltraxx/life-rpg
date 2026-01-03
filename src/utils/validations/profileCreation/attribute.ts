import { z } from "zod";

// TODO: Further refine schema
export const AttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name cannot be empty")
    .max(30, "Attribute name cannot exceed 30 characters"),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
});
