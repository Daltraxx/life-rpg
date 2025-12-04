import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { ListItem } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";

interface AttributeListItemProps {
  attribute: string;
  onDelete: (attribute: string) => void;
}

export default function AttributeListItem({
  attribute,
  onDelete,
}: AttributeListItemProps) {
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
