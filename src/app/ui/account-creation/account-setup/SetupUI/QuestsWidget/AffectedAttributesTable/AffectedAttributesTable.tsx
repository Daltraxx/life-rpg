import styles from "./styles.module.css";
import clsx from "clsx";
import { strengthDisplayMap } from "@/utils/helpers/StrengthDisplayMap";
import type { AffectedAttribute } from "@/utils/types/AttributesAndQuests";

interface AffectedAttributesTableProps {
  selectedAttributes: AffectedAttribute[];
  onDeleteAttribute: (name: string) => void;
}

/**
 * Displays a table of attributes affected by a quest, showing their strength
 * and providing a way to remove them.
 *
 * @param props - Component props
 * @param props.selectedAttributes - Array of attributes to display in the table
 * @param props.onDeleteAttribute - Callback function invoked when the remove button
 * is clicked, receives the attribute name as a parameter
 *
 * @returns A table component with attribute name, strength indicator, and remove button
 *
 * @example
 * ```tsx
 * <AffectedAttributesTable
 *   selectedAttributes={[
 *     { name: "Strength", strength: "plus" },
 *     { name: "Intelligence", strength: "plusPlus" }
 *   ]}
 *   onDeleteAttribute={(name) => console.log(`Removing ${name}`)}
 * />
 * ```
 */
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
                aria-label={`Remove ${attribute.name} from affected attributes`}
              >
                REMOVE
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
