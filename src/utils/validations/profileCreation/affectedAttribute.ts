import { z } from "zod";
import { AttributeStrengthValues } from "@/app/ui/utils/types/AttributeStrength";

// TODO: Further refine schema
export const AffectedAttributeSchema = z.object({
  name: z.string().trim().min(1, "Attribute name cannot be empty"),
  strength: z.enum(AttributeStrengthValues),
});
