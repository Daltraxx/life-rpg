"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import type { UseQuestAttributeSelectionReturn } from "@/utils/hooks/useQuestAttributeSelection";
import AttributeMenu from "./SelectMenus/AttributeMenu";
import StrengthMenu from "./SelectMenus/StrengthMenu";

interface AddAffectedAttributeUIProps {
  attributeSelection: UseQuestAttributeSelectionReturn;
  noAvailableAttributesText: string;
}

/**
 * A component for adding affected attributes to a quest during account setup.
 *
 * This component provides a UI for selecting an attribute from available options,
 * choosing the strength/impact level of that attribute, and adding it to the quest's
 * list of affected attributes.
 *
 * @param props - The component props
 * @param props.attributeSelection - Object containing attribute selection state and actions
 * @param props.attributeSelection.availableAttributes - List of attributes that can be selected
 * @param props.attributeSelection.currentAttributeName - The currently selected attribute name
 * @param props.attributeSelection.currentAttributeStrength - The currently selected strength value
 * @param props.attributeSelection.actions - Actions for managing attribute selection
 * @param props.attributeSelection.actions.setCurrentAttributeName - Function to update the selected attribute
 * @param props.attributeSelection.actions.setAttributeStrength - Function to update the attribute strength
 * @param props.attributeSelection.actions.addAffectedAttribute - Function to add the selected attribute to the quest
 * @param props.noAvailableAttributesText - Text to display when no attributes are available for selection
 *
 * @returns A fieldset containing attribute selection menus and an add button
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
