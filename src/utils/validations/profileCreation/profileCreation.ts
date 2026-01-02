import { z } from "zod";
import { QuestSchema } from "@/utils/validations/profileCreation/quest";
import { AttributeSchema } from "@/utils/validations/profileCreation/attribute";

// TODO: Further refine schema
// TODO: Ensure quest and attribute names are unique within their arrays
export const ProfileCreationSchema = z.object({
  userId: z.uuid("Invalid user ID"),
  quests: z.array(QuestSchema).min(1, "At least one quest is required"),
  attributes: z
    .array(AttributeSchema)
    .min(1, "At least one attribute is required"),
});

export type ProfileCreationState = {
  errors?: {
    userId?: string[];
    quests?: string[];
    attributes?: string[];
  };
  message?: string | null;
};