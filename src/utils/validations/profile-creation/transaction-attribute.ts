import { z } from "zod";
import {
  SAFE_CHARACTERS_REGEX,
  MAX_ATTRIBUTE_NAME_LENGTH,
  MIN_ATTRIBUTE_NAME_LENGTH,
} from "@/utils/constants/gameConstants";
import { addSIfPluralOrZero } from "@/utils/helpers/pluralOrSingularHandlers";

/**
 * TransactionAttributeSchema defines the validation rules for a attribute object
 * being used in a profile creation transaction.
 */
export const TransactionAttributeSchema = z.object({
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
    .regex(SAFE_CHARACTERS_REGEX, "Attribute name contains invalid characters")
});

export type TransactionAttribute = z.infer<typeof TransactionAttributeSchema>;
