import { z } from "zod";
import {
  MAX_ATTRIBUTES_ALLOWED,
  SAFE_CHARACTERS_REGEX,
  MAX_ATTRIBUTE_NAME_LENGTH,
  MIN_ATTRIBUTE_NAME_LENGTH,
} from "@/utils/constants/gameConstants";
import { addSIfPluralOrZero } from "@/utils/helpers/pluralOrSingularHandlers";

export const AttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_ATTRIBUTE_NAME_LENGTH,
      `Attribute name cannot be less than ${MIN_ATTRIBUTE_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MIN_ATTRIBUTE_NAME_LENGTH
      )}`
    )
    .max(
      MAX_ATTRIBUTE_NAME_LENGTH,
      `Attribute name cannot exceed ${MAX_ATTRIBUTE_NAME_LENGTH} characters`
    )
    .regex(SAFE_CHARACTERS_REGEX, "Attribute name contains invalid characters"),
  order: z
    .int("Order must be an integer")
    .nonnegative("Order must be a non-negative integer")
    .max(
      MAX_ATTRIBUTES_ALLOWED - 1,
      `Order cannot exceed ${MAX_ATTRIBUTES_ALLOWED - 1}`
    ),
});

export type Attribute = z.infer<typeof AttributeSchema>;
