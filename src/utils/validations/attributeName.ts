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

export const createAttributeNameSchema = (existingAttributes: Attribute[]) => {
  const existingAttributeNames = new Set(
    existingAttributes.map((attr) => attr.name.toLowerCase()),
  );

  return AttributeNameSchema.refine(
    (attrName) => !existingAttributeNames.has(attrName.toLowerCase()),
    "An attribute with this name already exists.",
  );
};
