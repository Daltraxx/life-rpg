import { z } from "zod";
import { TransactionQuestSchema } from "@/utils/validations/profile-edit/transaction-quest";
import { TransactionAttributeSchema } from "@/utils/validations/profile-edit/transaction-attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  MAX_QUESTS_ALLOWED,
  MIN_QUESTS_ALLOWED,
  MAX_ATTRIBUTES_ALLOWED,
  MIN_ATTRIBUTES_ALLOWED,
} from "@/utils/constants/gameConstants";
import { getNounAndVerbAgreement } from "@/utils/helpers/pluralOrSingularHandlers";

/**
 * Validation schema for profile editing form data, 
 * including quests and attributes with their respective constraints and uniqueness requirements. 
 * Also validates that deleted IDs do not conflict with updated entities.
 */
export const ProfileEditSchema = z
  .object({
    quests: z
      .array(TransactionQuestSchema)
      .min(
        MIN_QUESTS_ALLOWED,
        `At least ${MIN_QUESTS_ALLOWED} ${getNounAndVerbAgreement(
          "quest",
          MIN_QUESTS_ALLOWED,
        )} required`,
      )
      .max(
        MAX_QUESTS_ALLOWED,
        `No more than ${MAX_QUESTS_ALLOWED} ${getNounAndVerbAgreement(
          "quest",
          MAX_QUESTS_ALLOWED,
        )} allowed`,
      )
      .refine((quests) => hasUniqueValues(quests, "name"), {
        message: "Quest names must be unique",
      }),
    attributes: z
      .array(TransactionAttributeSchema)
      .min(
        MIN_ATTRIBUTES_ALLOWED,
        `At least ${MIN_ATTRIBUTES_ALLOWED} ${getNounAndVerbAgreement(
          "attribute",
          MIN_ATTRIBUTES_ALLOWED,
        )} required`,
      )
      .max(
        MAX_ATTRIBUTES_ALLOWED,
        `No more than ${MAX_ATTRIBUTES_ALLOWED} ${getNounAndVerbAgreement(
          "attribute",
          MAX_ATTRIBUTES_ALLOWED,
        )} allowed`,
      )
      .refine((attributes) => hasUniqueValues(attributes, "name"), {
        message: "Attribute names must be unique",
      }),
    deletedQuestIds: z.array(z.number()),
    deletedAttributeIds: z.array(z.number()),
    deletedAffectedAttributeIds: z.array(z.number()),
  })
  .refine(
    (data) => {
      const questIds = new Set(
        data.quests
          .map((q) => q.id)
          .filter((id): id is number => typeof id === "number"),
      );
      return !data.deletedQuestIds.some((id) => questIds.has(id));
    },
    { message: "Cannot delete and update the same quest" },
  )
  .refine(
    (data) => {
      const attrIds = new Set(
        data.attributes
          .map((a) => a.id)
          .filter((id): id is number => typeof id === "number"),
      );
      return !data.deletedAttributeIds.some((id) => attrIds.has(id));
    },
    { message: "Cannot delete and update the same attribute" },
  )
  .refine(
    (data) => {
      const affectedAttrIds = new Set(
        data.quests
          .flatMap((q) => q.affectedAttributes.map((aa) => aa.id))
          .filter((id): id is number => typeof id === "number"),
      );
      return !data.deletedAffectedAttributeIds.some((id) =>
        affectedAttrIds.has(id),
      );
    },
    { message: "Cannot delete and update the same affected attribute" },
  );

export type ProfileEditFormData = z.infer<typeof ProfileEditSchema>;

export type ProfileEditState = {
  errors?: {
    userId?: string[];
    quests?: string[];
    attributes?: string[];
    affectedAttributes?: string[];
    deletedQuestIds?: string[];
    deletedAttributeIds?: string[];
    deletedAffectedAttributeIds?: string[];
  };
  message?: string;
};
