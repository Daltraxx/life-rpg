import { z } from "zod";
import { AttributeStrengthValues } from "@/app/ui/utils/types/AttributeStrength";
import {
  SAFE_CHARACTERS_REGEX,
  MIN_ATTRIBUTE_NAME_LENGTH,
  MAX_ATTRIBUTE_NAME_LENGTH,
} from "@/utils/constants/gameConstants";
import { addSIfPluralOrZero } from "@/utils/helpers/pluralOrSingularHandlers";

export const AffectedAttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_ATTRIBUTE_NAME_LENGTH,
      `Affected Attribute name cannot be less than ${MIN_ATTRIBUTE_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MIN_ATTRIBUTE_NAME_LENGTH
      )}`
    )
    .max(
      MAX_ATTRIBUTE_NAME_LENGTH,
      `Affected Attribute name cannot exceed ${MAX_ATTRIBUTE_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MAX_ATTRIBUTE_NAME_LENGTH
      )}`
    )
    .regex(
      SAFE_CHARACTERS_REGEX,
      "Affected Attribute name contains invalid characters"
    ),
  strength: z.enum(AttributeStrengthValues, {
    message: "Please select a valid attribute strength",
  }),
});

export type AffectedAttribute = z.infer<typeof AffectedAttributeSchema>;
