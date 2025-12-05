import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { ListItem } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { JSX } from "react";

interface AttributeListItemProps {
  attribute: string;
  onDelete: (attribute: string) => void;
}

/**
 * Renders a single attribute list item with a remove button.
 * 
 * @component
 * @param {AttributeListItemProps} props - The component props
 * @param {string} props.attribute - The name of the attribute to display
 * @param {(attribute: string) => void} props.onDelete - Callback function invoked when the remove button is clicked
 * @returns {JSX.Element} A list item containing the attribute name and a remove button. The Discipline attribute cannot be removed and is visually indicated as required.
 * 
 * @example
 * <AttributeListItem 
 *   attribute="Strength" 
 *   onDelete={(attr) => console.log(`Removed ${attr}`)} 
 * />
 * 
 * @remarks
 * - The "Discipline" attribute is a required attribute and cannot be removed
 * - The remove button styling differs for the Discipline attribute to indicate its required status
 * - Uses FontAwesome XMark icon for the remove button
 */
export default function AttributeListItem({
  attribute,
  onDelete,
}: AttributeListItemProps): JSX.Element {
  const isDiscipline = attribute === "Discipline";

  return (
    <ListItem className={styles.attributeItem} size="24">
      <button
        aria-label={`Remove ${attribute}`}
        type="button"
        className={clsx(
          !isDiscipline && styles.removeAttributeButton,
          isDiscipline && styles.disciplineAttributeRemoveButton
        )}
        title={isDiscipline ? "Discipline is a required attribute" : undefined}
        onClick={() => onDelete(attribute)}
        disabled={isDiscipline}
      >
        <FontAwesomeIcon
          icon={faRectangleXmark}
          className={styles.removeAttributeIcon}
          aria-hidden="true"
        />
      </button>
      {attribute}
    </ListItem>
  );
}
