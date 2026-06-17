"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import type { AffectedAttributeManager } from "@/utils/hooks/useAffectedAttributeManager";
import AttributeMenu from "./SelectMenus/AttributeMenu";
import StrengthMenu from "./SelectMenus/StrengthMenu";

/**
 * Props for the AddAffectedAttributeUI component.
 *
 * @interface AddAffectedAttributeUIProps
 * @property {UseQuestAttributeSelectionReturn} attributeSelection - The attribute selection hook return object containing methods and state for managing quest attribute selection.
 * @property {string} noAvailableAttributesText - The text to display when there are no available attributes to select.
 */
export interface AddAffectedAttributeUIProps {
  affectedAttributeManager: AffectedAttributeManager;
}

/**
 * Renders a UI component for adding affected attributes to a quest.
 *
 * Allows users to select an attribute from available options, set the strength/impact
 * of that attribute, and add it to the quest's affected attributes list.
 *
 * @component
 * @param {AddAffectedAttributeUIProps} props - The component props
 * @param {AffectedAttributeManager} props.affectedAttributeManager - Manager object for affected attribute selection state and actions
 *
 * @returns {React.ReactElement} A fieldset containing attribute selection menus and an add button
 *
 * @example
 * ```tsx
 * <AddAffectedAttributeUI affectedAttributeManager={manager} />
 * ```
 */
export default function AddAffectedAttributeUI({
  affectedAttributeManager,
}: AddAffectedAttributeUIProps) {
  const {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    noAttributesAvailableText,
    actions: {
      setCurrentAttributeName,
      setAttributeStrength,
      addAffectedAttribute,
    },
  } = affectedAttributeManager;

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
              noAvailableAttributesText={noAttributesAvailableText}
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
          disabled={availableAttributes.length === 0}
        >
          ADD
        </button>
      </div>
    </fieldset>
  );
}
