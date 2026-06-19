import { z } from "zod";
import { TransactionAffectedAttributeSchema as ProfileCreationAffectedAttributeSchema } from "@/utils/validations/profile-creation/transaction-affected-attribute";

export const TransactionAffectedAttributeSchema =
  ProfileCreationAffectedAttributeSchema.extend({
    id: z.number().or(z.string()),
  });

export type TransactionAffectedAttribute = z.infer<
  typeof TransactionAffectedAttributeSchema
>;
