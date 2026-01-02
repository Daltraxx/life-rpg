import { z } from "zod";
import { AffectedAttributeSchema } from "@/utils/validations/profileCreation/affectedAttribute";

// TODO: Further refine schema
export const QuestSchema = z.object({
  name: z.string().min(1, "Quest name cannot be empty"),
  affectedAttributes: z
    .array(AffectedAttributeSchema)
    .min(1, "At least one affected attribute is required"),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
  experiencePointValue: z
    .number()
    .int()
    .nonnegative("Experience point value must be a non-negative integer")
    .max(100, "Experience point value must be at most 100"),
});
