import { z } from "zod";
import { QuestSchema } from "@/utils/validations/profileCreation/quest";
import { AttributeSchema } from "@/utils/validations/profileCreation/attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  MAX_QUESTS_ALLOWED,
  MIN_QUESTS_ALLOWED,
  MAX_ATTRIBUTES_ALLOWED,
  MIN_ATTRIBUTES_ALLOWED,
} from "@/utils/constants/gameConstants";
import { getNounAndVerbAgreement } from "@/utils/helpers/pluralOrSingularHandlers";

export const ProfileCreationSchema = z.object({
  quests: z
    .array(QuestSchema)
    .min(
      MIN_QUESTS_ALLOWED,
      `At least ${MIN_QUESTS_ALLOWED} ${getNounAndVerbAgreement(
        "quest",
        MIN_QUESTS_ALLOWED
      )} required`
    )
    .max(
      MAX_QUESTS_ALLOWED,
      `No more than ${MAX_QUESTS_ALLOWED} ${getNounAndVerbAgreement(
        "quest",
        MAX_QUESTS_ALLOWED
      )} allowed`
    )
    .refine((quests) => hasUniqueValues(quests, "name"), {
      message: "Quest names must be unique",
    }),
  attributes: z
    .array(AttributeSchema)
    .min(
      MIN_ATTRIBUTES_ALLOWED,
      `At least ${MIN_ATTRIBUTES_ALLOWED} ${getNounAndVerbAgreement(
        "attribute",
        MIN_ATTRIBUTES_ALLOWED
      )} required`
    )
    .max(
      MAX_ATTRIBUTES_ALLOWED,
      `No more than ${MAX_ATTRIBUTES_ALLOWED} ${getNounAndVerbAgreement(
        "attribute",
        MAX_ATTRIBUTES_ALLOWED
      )} allowed`
    )
    .refine((attributes) => hasUniqueValues(attributes, "name"), {
      message: "Attribute names must be unique",
    }),
});

export type ProfileCreationFormData = z.infer<typeof ProfileCreationSchema>;

export type ProfileCreationState = {
  errors?: {
    userId?: string[];
    quests?: string[];
    attributes?: string[];
  };
  message?: string;
};
