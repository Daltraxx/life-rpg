import { z } from "zod";
import { AttributeNameSchema } from "./attribute-name";

/**
 * Defines the schema for validating an Attribute object, which represents a character attribute in the game.
 */
export const AttributeSchema = z.object({
  name: AttributeNameSchema,
  experience: z.number().nonnegative("Experience must be a non-negative number"),
  level: z.number().min(1, "Level must be at least 1"),
  position: z.number().min(0, "Position must be at least 0"),
});

export type Attribute = z.infer<typeof AttributeSchema>;