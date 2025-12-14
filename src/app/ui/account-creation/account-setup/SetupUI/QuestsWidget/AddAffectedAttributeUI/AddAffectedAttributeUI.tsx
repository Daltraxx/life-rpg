"use client";

import styles from "./styles.module.css";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import clsx from "clsx";
import { strengthDisplayMap } from "@/app/ui/utils/helpers/StrengthDisplayMap";
import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";
import type { UseAttributeSelection } from "@/utils/hooks/useAttributeSelection";
import AttributeMenu from "./SelectMenus/AttributeMenu";

export default function AddAffectedAttributeUI({
  attributeSelection,
  noAvailableAttributesText,
}: {
  attributeSelection: UseAttributeSelection;
  noAvailableAttributesText: string;
}) {
  const {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    attributeNameMenuOpen,
    attributeStrengthMenuOpen,
    actions: attributeActions,
  } = attributeSelection;

  const {
    setCurrentAttributeName,
    setAttributeStrength,
    addAffectedAttribute,
    setAttributeNameMenuOpen,
    setAttributeStrengthMenuOpen,
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
            <button
              type="button"
              className={clsx(
                currentAttributeStrength === "plus" ||
                  currentAttributeStrength === "plusPlus"
                  ? styles.plus
                  : null
              )}
              aria-expanded={attributeStrengthMenuOpen}
              aria-controls="attribute-strength-menu"
              aria-haspopup="true"
              onClick={() =>
                setAttributeStrengthMenuOpen(!attributeStrengthMenuOpen)
              }
            >
              {strengthDisplayMap[currentAttributeStrength]}
            </button>
            <div
              id="attribute-strength-menu"
              role="menu"
              className={clsx(
                styles.menu,
                attributeStrengthMenuOpen && styles.open
              )}
            >
              {(Object.keys(strengthDisplayMap) as AttributeStrength[]).map(
                (strengthKey) => (
                  <Label key={strengthKey}>
                    <input
                      type="radio"
                      name="attributeStrength"
                      value={strengthKey}
                      checked={currentAttributeStrength === strengthKey}
                      onChange={() => setAttributeStrength(strengthKey)}
                    />
                    {strengthDisplayMap[strengthKey]}
                  </Label>
                )
              )}
            </div>
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
