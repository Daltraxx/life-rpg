import { z } from "zod";
import { QuestSchema } from "@/utils/validations/profileCreation/quest";
import { AttributeSchema } from "@/utils/validations/profileCreation/attribute";
import hasUniqueValues from '@/utils/helpers/hasUniqueValues';

// TODO: Further refine schema
// TODO: Ensure quest and attribute names are unique within their arrays
export const ProfileCreationSchema = z.object({
  userId: z.uuid("Invalid user ID"),
  quests: z
    .array(QuestSchema)
    .min(1, "At least one quest is required")
    .refine(
      (quests) => hasUniqueValues(quests, 'name'),
      { message: "Quest names must be unique" }
    ),
  attributes: z
    .array(AttributeSchema)
    .min(1, "At least one attribute is required")
    .refine(
      (attributes) => hasUniqueValues(attributes, 'name'),
      { message: "Attribute names must be unique" }
    ),
});

export type ProfileCreationState = {
  errors?: {
    userId?: string[];
    quests?: string[];
    attributes?: string[];
  };
  message?: string | null;
};
