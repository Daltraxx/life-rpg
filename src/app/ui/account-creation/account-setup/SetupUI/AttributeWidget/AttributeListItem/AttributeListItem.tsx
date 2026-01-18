import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { ListItem } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";
import { JSX, useCallback } from "react";
import { type Attribute } from "@/utils/types/AttributesAndQuests";
import {
  ChevronDownButton,
  ChevronUpButton,
} from "@/app/ui/Buttons/ChevronButtons/ChevronButtons";

interface AttributeListItemProps {
  attribute: Attribute;
  onDelete: (attribute: Attribute) => void;
  handleMoveUp: (attribute: Attribute) => void;
  handleMoveDown: (attribute: Attribute) => void;
  attributesLength: number;
  index: number;
}

const REQUIRED_DISCIPLINE_ATTRIBUTE = "Discipline";

/**
 * Renders a single attribute item in a list with a remove button.
 *
 * @param props - The component props
 * @param props.attribute - The attribute object to display
 * @param props.onDelete - Callback function invoked when the delete button is clicked
 * @param props.handleMoveUp - Callback function to move the attribute up in the list
 * @param props.handleMoveDown - Callback function to move the attribute down in the list
 * @param props.attributesLength - The total number of attributes in the list (used to conditionally render move buttons)
 * @param props.index - The index of the attribute in the list
 *
 * @returns A list item containing the attribute name and a remove button
 *
 * @remarks
 * The "Discipline" attribute is a required attribute and cannot be deleted.
 * The delete button will be disabled for the Discipline attribute with an appropriate
 * aria-label and title explaining why it cannot be removed.
 */
export default function AttributeListItem({
  attribute,
  onDelete,
  handleMoveUp,
  handleMoveDown,
  attributesLength,
  index,
}: AttributeListItemProps): JSX.Element {
  const isDiscipline = attribute.name === REQUIRED_DISCIPLINE_ATTRIBUTE;
  const handleDelete = useCallback(() => {
    if (!isDiscipline) {
      onDelete(attribute);
    }
  }, [attribute, onDelete]);

  return (
    <ListItem className={styles.attributeItem} size="24">
      <button
        aria-label={
          isDiscipline
            ? "Discipline is a required attribute and cannot be removed"
            : `Remove ${attribute.name} attribute`
        }
        type="button"
        className={clsx(
          !isDiscipline && styles.removeAttributeButton,
          isDiscipline && styles.disciplineAttributeRemoveButton,
        )}
        title={isDiscipline ? "Discipline is a required attribute" : undefined}
        onClick={handleDelete}
        disabled={isDiscipline}
      >
        <FontAwesomeIcon
          icon={faRectangleXmark}
          className={styles.removeAttributeIcon}
          aria-hidden="true"
        />
      </button>
      {attribute.name}
      {index > 0 && (
        <ChevronUpButton
          size={24}
          onClick={() => handleMoveUp(attribute)}
          iconColor="blue-700"
          backgroundColor="none"
          hoverBackgroundColor="gray-200"
          aria-label="Move attribute up"
        />
      )}
      {index < attributesLength - 1 && (
        <ChevronDownButton
          size={24}
          onClick={() => handleMoveDown(attribute)}
          iconColor="blue-700"
          backgroundColor="none"
          hoverBackgroundColor="gray-200"
          aria-label="Move attribute down"
        />
      )}
    </ListItem>
  );
}
