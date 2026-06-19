import { z } from "zod";
import { TransactionAttributeSchema as ProfileCreationAttributeSchema } from "@/utils/validations/profile-creation/transaction-attribute";

export const TransactionAttributeSchema = ProfileCreationAttributeSchema.extend({
  id: z.string().optional(),
  experience: z.number().nonnegative("Experience must be a non-negative number"),
  level: z.number().nonnegative("Level must be a non-negative number"),
  position: z.number().nonnegative("Position must be a non-negative number"),
});

export type TransactionAttribute = z.infer<typeof TransactionAttributeSchema>;