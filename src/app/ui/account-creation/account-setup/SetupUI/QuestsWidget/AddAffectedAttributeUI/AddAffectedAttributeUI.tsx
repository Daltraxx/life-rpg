"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import type { UseQuestAttributeSelectionReturn } from "@/utils/hooks/useQuestAttributeSelection";
import AttributeMenu from "./SelectMenus/AttributeMenu";
import StrengthMenu from "./SelectMenus/StrengthMenu";

/**
 * Props for the AddAffectedAttributeUI component.
 * 
 * @interface AddAffectedAttributeUIProps
 * @property {UseQuestAttributeSelectionReturn} attributeSelection - The attribute selection hook return object containing methods and state for managing quest attribute selection.
 * @property {string} noAvailableAttributesText - The text to display when there are no available attributes to select.
 */
interface AddAffectedAttributeUIProps {
  attributeSelection: UseQuestAttributeSelectionReturn;
  noAvailableAttributesText: string;
}

/**
 * A component that provides UI for adding affected attributes to a quest.
 * 
 * Displays a fieldset containing dropdown menus for selecting an attribute and its strength,
 * along with an "ADD" button to add the selected attribute to the quest. The button is disabled
 * when no attributes are available for selection.
 * 
 * @param props - The component props
 * @param props.attributeSelection - Object containing available attributes, current selections, and actions
 * @param props.noAvailableAttributesText - Text displayed when no attributes are available for selection
 * 
 * @returns A fieldset component with attribute selection UI
 */
export default function AddAffectedAttributeUI({
  attributeSelection,
  noAvailableAttributesText,
}: AddAffectedAttributeUIProps) {
  const {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    actions: attributeActions,
  } = attributeSelection;

  const {
    setCurrentAttributeName,
    setAttributeStrength,
    addAffectedAttribute,
  } = attributeActions;

  return (
    <fieldset className={styles.addAffectedAttributeFieldset}>
      <div className={styles.addAffectedAttributeContainer}>
        <legend className={styles.label}>Affected Attributes:</legend>

        {/* AFFECTED ATTRIBUTE */}
        <div className={styles.attributeOptionsContainer}>
          <div
            className={clsx(
              styles.menuContainer,
              styles.attributeSelectMenuContainer
            )}
          >
            <AttributeMenu
              availableAttributes={availableAttributes}
              currentAttribute={currentAttributeName}
              onAttributeSelect={setCurrentAttributeName}
            />
          </div>

          {/* AMOUNT ATTRIBUTE IS AFFECTED BY QUEST */}
          <div
            className={clsx(
              styles.menuContainer,
              styles.attributeStrengthMenuContainer
            )}
          >
            <StrengthMenu
              currentStrength={currentAttributeStrength}
              onStrengthSelect={setAttributeStrength}
            />
          </div>
        </div>

        {/* ADD ATTRIBUTE TO QUEST BUTTON */}
        <button
          className={clsx(styles.appendedButton, styles.addAttributeButton)}
          type="button"
          onClick={addAffectedAttribute}
          disabled={currentAttributeName === noAvailableAttributesText}
        >
          ADD
        </button>
      </div>
    </fieldset>
  );
}
