import styles from "./styles.module.css";
import clsx from "clsx";
import { strengthDisplayMap } from "@/utils/helpers/StrengthDisplayMap";
import type { AffectedAttribute } from "@/utils/types/AffectedAttribute";
import componentStyles from "@/app/ui/shared-css/common.module.css";

interface AffectedAttributesTableProps {
  selectedAttributes: AffectedAttribute[];
  onDeleteAttribute: (id: string | number) => void;
}

/**
 * Displays a table of attributes affected by a quest, showing their strength
 * and providing a way to remove them.
 *
 * @param props - Component props
 * @param props.selectedAttributes - Array of attributes to display in the table
 * @param props.onDeleteAttribute - Callback function invoked when the remove button
 * is clicked, receives the attribute ID as a parameter
 *
 * @returns A table component with attribute name, strength indicator, and remove button
 *
 * @example
 * ```tsx
 * <AffectedAttributesTable
 *   selectedAttributes={[
 *     { id: 1, name: "Strength", strength: "plus" },
 *     { id: 2, name: "Intelligence", strength: "plusPlus" }
 *   ]}
 *   onDeleteAttribute={(id) => console.log(`Removing attribute with ID: ${id}`)}
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
          <tr key={attribute.id} className={styles.affectedAttributeRow}>
            <td
              className={clsx(
                styles.affectedAttributeCell,
                styles.affectedAttributeName,
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
                  : null,
              )}
            >
              {strengthDisplayMap[attribute.strength]}
            </td>
            <td className={clsx(styles.deleteAttributeButtonCell)}>
              <button
                className={clsx(
                  componentStyles.appendedButton,
                  styles.deleteAttributeButton,
                )}
                onClick={() => onDeleteAttribute(attribute.id)}
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
