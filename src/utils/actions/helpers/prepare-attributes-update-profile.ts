import {
  EditProfileTransactionAttributeInsert,
  EditProfileTransactionAttributeUpdate,
} from "@/utils/types/edit-profile-transaction";
import { TransactionAttribute } from "@/utils/validations/profile-edit/transaction-attribute";

interface PreparedAttributeUpdates {
  attributeInserts: EditProfileTransactionAttributeInsert[];
  attributeUpdates: EditProfileTransactionAttributeUpdate[];
}

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
        name: attr.name,
        position: index,
      });
    }
  });

  return { attributeInserts, attributeUpdates };
};
