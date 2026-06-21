import { z } from "zod";
import { TransactionAttributeSchema as ProfileCreationAttributeSchema } from "@/utils/validations/profile-creation/transaction-attribute";

export const TransactionAttributeSchema = ProfileCreationAttributeSchema.extend({
  id: z.union([z.number(), z.string().min(1, "ID must not be empty")]), // Allow both existing attributes with numeric IDs and new attributes with string client keys
  experience: z.int().nonnegative("Experience must be a non-negative number"),
  level: z.int().nonnegative("Level must be a non-negative number"),
  position: z.int().nonnegative("Position must be a non-negative number"),
});

export type TransactionAttribute = z.infer<typeof TransactionAttributeSchema>;