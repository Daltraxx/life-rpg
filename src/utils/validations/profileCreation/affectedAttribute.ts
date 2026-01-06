import { z } from "zod";
import { AttributeStrengthValues } from "@/app/ui/utils/types/AttributeStrength";
import { SAFE_CHARACTERS_REGEX } from "@/utils/constants/gameConstants";

export const AffectedAttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name cannot be empty")
    .max(30, "Attribute name cannot exceed 30 characters")
    .regex(SAFE_CHARACTERS_REGEX, "Affected Attribute name contains invalid characters"),
  strength: z.enum(AttributeStrengthValues, {
    message: "Please select a valid attribute strength",
  }),
});

export type AffectedAttribute = z.infer<typeof AffectedAttributeSchema>;
