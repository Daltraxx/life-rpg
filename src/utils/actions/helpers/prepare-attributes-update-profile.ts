import {
  EditProfileTransactionAttributeInsert,
  EditProfileTransactionAttributeUpdate,
} from "@/utils/types/edit-profile-transaction";
import { TransactionAttribute } from "@/utils/validations/profile-edit/transaction-attribute";

/**
 * An object containing arrays of attribute inserts and updates for profile update transactions.
 *
 * - `attributeInserts`: An array of attributes that need to be inserted, each containing a client key, name, and position.
 * - `attributeUpdates`: An array of attributes that need to be updated, each containing an ID, name, and position.
 */
interface PreparedAttributeUpdates {
  attributeInserts: EditProfileTransactionAttributeInsert[];
  attributeUpdates: EditProfileTransactionAttributeUpdate[];
}

/**
 * Prepares an array of attributes for profile update by separating them into inserts and updates.
 * Attributes with numeric IDs are treated as updates, while attributes without IDs are treated as inserts.
 *
 * @param attributes - An array of TransactionAttribute objects to be prepared for update
 * @returns An object containing arrays of attribute inserts and updates
 * @example
 * const result = prepareAttributesForProfileUpdate([
 *   { id: 1, name: "Strength", position: 0 },
 *   { id: "abc-123", name: "Intelligence", position: 1 }
 * ]);
 * // Returns: { attributeInserts: [...], attributeUpdates: [...] }
 */
export const prepareAttributesForProfileUpdate = (
  attributes: TransactionAttribute[],
): PreparedAttributeUpdates => {
  const attributeInserts: EditProfileTransactionAttributeInsert[] = [];
  const attributeUpdates: EditProfileTransactionAttributeUpdate[] = [];
  attributes.forEach((attr, index) => {
    if (typeof attr.id === "number") {
      attributeUpdates.push({
        id: attr.id,
        name: attr.name,
        position: index,
      });
    } else {
      attributeInserts.push({
        client_key: attr.id as string, // Use the string ID as a temporary key for mapping to the new ID in the database
        name: attr.name,
        position: index,
      });
    }
  });

  return { attributeInserts, attributeUpdates };
};
