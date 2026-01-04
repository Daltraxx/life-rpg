import { z } from "zod";
import { AffectedAttributeSchema } from "@/utils/validations/profileCreation/affectedAttribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";

// TODO: Further refine schema
export const QuestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Quest name cannot be empty")
    .max(50, "Quest name cannot exceed 50 characters"),
  affectedAttributes: z
    .array(AffectedAttributeSchema)
    .min(1, "At least one affected attribute is required")
    .refine(
      (attributes) => {
        return hasUniqueValues(attributes, "name");
      },
      { message: "Affected attribute names must be unique" }
    ),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
  experiencePointValue: z
    .number()
    .int()
    .nonnegative("Experience point value must be a non-negative integer")
    .max(100, "Experience point value must be at most 100"),
});
