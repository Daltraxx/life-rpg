import { z } from "zod";
import { TransactionAffectedAttributeSchema } from "@/utils/validations/profile-creation/transaction-affected-attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  SAFE_CHARACTERS_REGEX,
  MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_EXPERIENCE_POINTS_PER_QUEST,
  MIN_QUEST_NAME_LENGTH,
  MAX_QUEST_NAME_LENGTH,
  MAX_QUEST_DESCRIPTION_LENGTH,
  QUEST_STRENGTH_LEVELS,
} from "@/utils/constants/gameConstants";
import {
  addSIfPluralOrZero,
  getNounAndVerbAgreement,
} from "@/utils/helpers/pluralOrSingularHandlers";

export const TransactionQuestSchema = z.object({
  id: z.number().or(z.string()),
  name: z
    .string()
    .trim()
    .min(
      MIN_QUEST_NAME_LENGTH,
      `Quest name cannot be less than ${MIN_QUEST_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MIN_QUEST_NAME_LENGTH,
      )}`,
    )
    .max(
      MAX_QUEST_NAME_LENGTH,
      `Quest name cannot exceed ${MAX_QUEST_NAME_LENGTH} ${addSIfPluralOrZero(
        "character",
        MAX_QUEST_NAME_LENGTH,
      )}`,
    )
    .regex(SAFE_CHARACTERS_REGEX, "Quest name contains invalid characters"),
  description: z
    .string()
    .trim()
    .min(0, "Description cannot be empty")
    .max(
      MAX_QUEST_DESCRIPTION_LENGTH,
      `Description cannot exceed ${MAX_QUEST_DESCRIPTION_LENGTH} characters`,
    )
    .nullable(),
  affectedAttributes: z
    .array(TransactionAffectedAttributeSchema)
    .min(
      MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
      `At least ${MIN_AFFECTED_ATTRIBUTES_PER_QUEST} ${getNounAndVerbAgreement(
        "affected attribute",
        MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
      )} required`,
    )
    .max(
      MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
      `A maximum of ${MAX_AFFECTED_ATTRIBUTES_PER_QUEST} ${getNounAndVerbAgreement(
        "affected attribute",
        MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
      )} allowed`,
    )
    .refine((attributes) => hasUniqueValues(attributes, "name"), {
      message: "Affected attribute names must be unique",
    }),
  experienceShare: z
    .int()
    .nonnegative("Experience share must be a non-negative integer")
    .min(1, "Each quest must be worth at least 1 experience point")
    .max(
      MAX_EXPERIENCE_POINTS_PER_QUEST,
      `Experience point value must be at most ${MAX_EXPERIENCE_POINTS_PER_QUEST}`,
  ),
  frequency: z.number().int().positive("Frequency must be a positive integer"),
  restFrequency: z
    .number()
    .int()
    .nonnegative("Rest frequency must be a non-negative integer"),
  streak: z.number().int().nonnegative("Streak must be a non-negative integer"),
  strengthPoints: z
    .number()
    .int()
    .nonnegative("Strength points must be a non-negative integer"),
  strengthLevel: z.enum(QUEST_STRENGTH_LEVELS),
  position: z.number().int().nonnegative("Position must be a non-negative integer"),
});

export type TransactionQuest = z.infer<typeof TransactionQuestSchema>;
