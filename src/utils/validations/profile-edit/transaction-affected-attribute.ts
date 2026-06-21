import { z } from "zod";
import { TransactionAffectedAttributeSchema as ProfileCreationAffectedAttributeSchema } from "@/utils/validations/profile-creation/transaction-affected-attribute";

export const TransactionAffectedAttributeSchema =
  ProfileCreationAffectedAttributeSchema.extend({
    id: z.union([z.number(), z.string().min(1, "ID must not be empty")]),
  });

export type TransactionAffectedAttribute = z.infer<
  typeof TransactionAffectedAttributeSchema
>;
