import { z } from "zod";
import { QuestSchema } from "@/utils/validations/profileCreation/quest";
import { AttributeSchema } from "@/utils/validations/profileCreation/attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";
import {
  MAX_QUESTS_ALLOWED,
  MAX_ATTRIBUTES_ALLOWED,
} from "@/app/ui/utils/constants/gameConstants";

export const ProfileCreationSchema = z.object({
  userId: z.uuid("Invalid user ID"),
  quests: z
    .array(QuestSchema)
    .min(1, "At least one quest is required")
    .max(
      MAX_QUESTS_ALLOWED,
      `No more than ${MAX_QUESTS_ALLOWED} quests are allowed`
    )
    .refine((quests) => hasUniqueValues(quests, "name"), {
      message: "Quest names must be unique",
    }),
  attributes: z
    .array(AttributeSchema)
    .min(1, "At least one attribute is required")
    .max(
      MAX_ATTRIBUTES_ALLOWED,
      `No more than ${MAX_ATTRIBUTES_ALLOWED} attributes are allowed`
    )
    .refine((attributes) => hasUniqueValues(attributes, "name"), {
      message: "Attribute names must be unique",
    }),
});

export type ProfileCreationFormData = z.infer<typeof ProfileCreationSchema>;

export type ProfileCreationState = {
  errors?: {
    userId?: string[];
    quests?: string[] | Record<number, Record<string, string[]>>;
    attributes?: string[] | Record<number, Record<string, string[]>>;
  };
  message?: string;
};
