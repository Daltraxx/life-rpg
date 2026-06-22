import {
  intToStrengthMap,
  isStrengthKey,
} from "@/utils/helpers/strengthToIntMap";

export type AffectedAttributesQueryResult = {
  id: number;
  strength: number;
  attributes: {
    id: number;
    name: string;
  };
}[];

/**
 * Maps affected attributes from a query result to a standardized format to be attached to a quest.
 *
 * @param questId - The ID of the quest being processed (used for error messages)
 * @param affectedAttributes - The raw query result containing strength and attribute data
 * @returns An array of mapped attributes with id, name, and strength properties
 * @throws {Error} When attribute data is missing for a quest
 * @throws {Error} When an invalid strength value is encountered
 */
export default function mapAffectedAttributes(
  questId: number,
  affectedAttributes: AffectedAttributesQueryResult,
) {
  return (
    affectedAttributes?.map((questAttr) => {
      // Ternary to handle both array and single object cases for attributes
      // due to the way Supabase returns related data when using .select with nested relationships
      const attribute = Array.isArray(questAttr.attributes)
        ? questAttr.attributes[0]
        : questAttr.attributes;

      if (!attribute) {
        throw new Error(`Missing attribute data for quest ID ${questId}`);
      }

      const { strength } = questAttr;
      if (!isStrengthKey(strength)) {
        throw new Error(
          `Invalid strength value for quest attribute: ${strength}`,
        );
      }
      return {
        id: questAttr.id,
        name: attribute.name,
        strength: intToStrengthMap[strength],
      };
    }) ?? []
  );
}
