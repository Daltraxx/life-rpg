import { z } from "zod";
import { TransactionAffectedAttributeSchema } from "@/utils/validations/profile-edit/transaction-affected-attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  MIN_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_AFFECTED_ATTRIBUTES_PER_QUEST,
  MAX_QUEST_DESCRIPTION_LENGTH,
  QUEST_STRENGTH_LEVELS,
} from "@/utils/constants/gameConstants";
import { getNounAndVerbAgreement } from "@/utils/helpers/pluralOrSingularHandlers";
import { TransactionQuestSchema as ProfileCreationQuestSchema } from "../profile-creation/transaction-quest";

export const TransactionQuestSchema = ProfileCreationQuestSchema.extend({
  id: z.number().or(z.string()),
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
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
  position: z
    .number()
    .int()
    .nonnegative("Position must be a non-negative integer"),
});

export type TransactionQuest = z.infer<typeof TransactionQuestSchema>;
