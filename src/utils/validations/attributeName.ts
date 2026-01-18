import { z } from "zod";
import type { Attribute } from "@/utils/types/AttributesAndQuests";
import {
  SAFE_CHARACTERS_REGEX,
  MIN_ATTRIBUTE_NAME_LENGTH,
  MAX_ATTRIBUTE_NAME_LENGTH,
} from "@/utils/constants/gameConstants";
import { addSIfPluralOrZero } from "@/utils/helpers/pluralOrSingularHandlers";

export const AttributeNameSchema = z
  .string()
  .trim()
  .min(
    MIN_ATTRIBUTE_NAME_LENGTH,
    `Attribute name cannot be less than ${MIN_ATTRIBUTE_NAME_LENGTH} ${addSIfPluralOrZero(
      "character",
      MIN_ATTRIBUTE_NAME_LENGTH,
    )}`,
  )
  .max(
    MAX_ATTRIBUTE_NAME_LENGTH,
    `Attribute name cannot exceed ${MAX_ATTRIBUTE_NAME_LENGTH} characters`,
  )
  .regex(SAFE_CHARACTERS_REGEX, "Attribute name contains invalid characters");

/**
 * Creates a Zod schema for validating attribute names with uniqueness constraint.
 *
 * @param existingAttributes - Array of existing attributes to check against for name duplicates
 * @returns A refined Zod schema that validates attribute names and ensures uniqueness
 *
 * @example
 * const schema = createAttributeNameSchema(existingAttributes);
 * const result = schema.parse("New Attribute"); // Valid if name doesn't exist
 *
 * @remarks
 * - The validation is case-insensitive
 * - Existing attribute names are normalized to lowercase for comparison
 * - Returns a validation error if an attribute with the same name already exists
 */
export const createAttributeNameSchema = (existingAttributes: Attribute[]) => {
  const existingAttributeNames = new Set(
    existingAttributes.map((attr) => attr.name.toLowerCase()),
  );

  return AttributeNameSchema.refine(
    (attrName) => !existingAttributeNames.has(attrName.toLowerCase()),
    "An attribute with this name already exists.",
  );
};
