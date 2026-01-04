import { z } from "zod";
import { QuestSchema } from "@/utils/validations/profileCreation/quest";
import { AttributeSchema } from "@/utils/validations/profileCreation/attribute";
import hasUniqueValues from "@/utils/helpers/hasUniqueValues";

export const ProfileCreationSchema = z.object({
  userId: z.uuid("Invalid user ID"),
  quests: z
    .array(QuestSchema)
    .min(1, "At least one quest is required")
    .max(50, "No more than 50 quests are allowed")
    .refine((quests) => hasUniqueValues(quests, "name"), {
      message: "Quest names must be unique",
    }),
  attributes: z
    .array(AttributeSchema)
    .min(1, "At least one attribute is required")
    .max(50, "No more than 50 attributes are allowed")
    .refine((attributes) => hasUniqueValues(attributes, "name"), {
      message: "Attribute names must be unique",
    }),
});

export type ProfileCreationState = {
  errors?: {
    userId?: string[];
    quests?: string[];
    attributes?: string[];
  };
  message?: string | null;
};
