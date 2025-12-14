import styles from "./styles.module.css";
import clsx from "clsx";
import { strengthDisplayMap } from "../QuestsWidget";
import type { AffectedAttribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

interface AffectedAttributesTableProps {
  selectedAttributes: AffectedAttribute[];
  onDeleteAttribute: (name: string) => void;
}

export default function AffectedAttributesTable({
  selectedAttributes,
  onDeleteAttribute,
}: AffectedAttributesTableProps) {
  return (
    <table className={styles.affectedAttributesTable}>
      <thead className={styles.srOnly}>
        <tr>
          <th>Attribute</th>
          <th>Strength</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {selectedAttributes.map((attribute) => (
          <tr key={attribute.name} className={styles.affectedAttributeRow}>
            <td
              className={clsx(
                styles.affectedAttributeCell,
                styles.affectedAttributeName
              )}
            >
              {attribute.name}
            </td>
            <td
              className={clsx(
                styles.affectedAttributeCell,
                styles.affectedAttributeStrength,
                attribute.strength === "plus" ||
                  attribute.strength === "plusPlus"
                  ? styles.plus
                  : null
              )}
            >
              {strengthDisplayMap[attribute.strength]}
            </td>
            <td className={clsx(styles.deleteAttributeButtonCell)}>
              <button
                className={clsx(
                  styles.appendedButton,
                  styles.deleteAttributeButton
                )}
                onClick={() => onDeleteAttribute(attribute.name)}
                type="button"
              >
                DELETE
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
