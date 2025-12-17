"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import type { useQuestAttributeSelection } from "@/utils/hooks/useQuestAttributeSelection";
import AttributeMenu from "./SelectMenus/AttributeMenu";
import StrengthMenu from "./SelectMenus/StrengthMenu";

export default function AddAffectedAttributeUI({
  attributeSelection,
  noAvailableAttributesText,
}: {
  attributeSelection: useQuestAttributeSelection;
  noAvailableAttributesText: string;
}) {
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
