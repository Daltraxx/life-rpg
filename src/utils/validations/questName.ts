import { z } from "zod";
import {
  MAX_QUEST_NAME_LENGTH,
  MIN_QUEST_NAME_LENGTH,
  SAFE_CHARACTERS_REGEX,
} from "@/utils/constants/gameConstants";
import { addSIfPluralOrZero } from "../helpers/pluralOrSingularHandlers";

export const QuestNameSchema = z
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
    `Quest name cannot exceed ${MAX_QUEST_NAME_LENGTH} characters`,
  )
  .regex(SAFE_CHARACTERS_REGEX, "Quest name contains invalid characters");

/**
 * Creates a Zod schema for validating quest names with uniqueness constraint.
 *
 * @param existingQuests - An array of existing quest objects containing their names
 * @returns A refined Zod schema that validates quest names and ensures they don't duplicate existing quest names
 * @throws Will fail validation if the quest name already exists (case-insensitive comparison)
 *
 * @example
 * const schema = createQuestNameSchema([{ name: 'Dragon Slayer' }]);
 * schema.parse('New Quest'); // passes
 * schema.parse('dragon slayer'); // fails - name already exists
 */
export const createQuestNameSchema = (existingQuests: { name: string }[]) => {
  const existingQuestNames = new Set(
    existingQuests.map((quest) => quest.name.toLowerCase()),
  );
  return QuestNameSchema.refine(
    (questName) => !existingQuestNames.has(questName.toLowerCase()),
    "A quest with this name already exists.",
  );
};
