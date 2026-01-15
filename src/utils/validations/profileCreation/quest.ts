import { z } from "zod";
import { AffectedAttributeSchema } from "@/utils/validations/profileCreation/affectedAttribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  SAFE_CHARACTERS_REGEX,
  MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_EXPERIENCE_POINTS_PER_QUEST,
  MIN_QUEST_NAME_LENGTH,
  MAX_QUEST_NAME_LENGTH,
} from "@/utils/constants/gameConstants";
import {
  addSIfPluralOrZero,
  getNounAndVerbAgreement,
} from "@/utils/helpers/pluralOrSingularHandlers";

export const QuestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_QUEST_NAME_LENGTH,
      `Quest name cannot be less than ${MIN_QUEST_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MIN_QUEST_NAME_LENGTH
      )}`
    )
    .max(
      MAX_QUEST_NAME_LENGTH,
      `Quest name cannot exceed ${MAX_QUEST_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MAX_QUEST_NAME_LENGTH
      )}`
    )
    .regex(SAFE_CHARACTERS_REGEX, "Quest name contains invalid characters"),
  affectedAttributes: z
    .array(AffectedAttributeSchema)
    .min(
      MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
      `At least ${MIN_AFFECTED_ATTRIBUTES_PER_QUEST} ${getNounAndVerbAgreement(
        "affected attribute",
        MIN_AFFECTED_ATTRIBUTES_PER_QUEST
      )} required`
    )
    .max(
      MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
      `A maximum of ${MAX_AFFECTED_ATTRIBUTES_PER_QUEST} ${getNounAndVerbAgreement(
        "affected attribute",
        MAX_AFFECTED_ATTRIBUTES_PER_QUEST
      )} allowed`
    )
    .refine((attributes) => hasUniqueValues(attributes, "name"), {
      message: "Affected attribute names must be unique",
    }),
  experiencePointValue: z
    .int()
    .nonnegative("Experience point value must be a non-negative integer")
    .max(
      MAX_EXPERIENCE_POINTS_PER_QUEST,
      `Experience point value must be at most ${MAX_EXPERIENCE_POINTS_PER_QUEST}`
    ),
});

export type Quest = z.infer<typeof QuestSchema>;
