import styles from "./styles.module.css";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import clsx from "clsx";
import { AttributeStrength, strengthDisplayMap } from "../QuestsWidget";

interface AddAffectedAttributeUIProps { 
  attributeNameMenuOpen: boolean;
  setAttributeNameMenuOpen: (open: boolean) => void;
  attributeStrengthMenuOpen: boolean;
  setAttributeStrengthMenuOpen: (open: boolean) => void;
  currentAttributeName: string;
  setCurrentAttributeName: (name: string) => void;
  currentAttributeStrength: AttributeStrength;
  handleSetAttributeStrength: (strength: AttributeStrength) => void;
  availableAttributes: string[];
  NO_AVAILABLE_ATTRIBUTES_TEXT: string;
  handleAddAffectedAttribute: () => void;
}

export default function AddAffectedAttributeUI({ 
  attributeNameMenuOpen,
  setAttributeNameMenuOpen,
  attributeStrengthMenuOpen,
  setAttributeStrengthMenuOpen,
  currentAttributeName,
  setCurrentAttributeName,
  currentAttributeStrength,
  handleSetAttributeStrength,
  availableAttributes,
  NO_AVAILABLE_ATTRIBUTES_TEXT,
  handleAddAffectedAttribute,
}: AddAffectedAttributeUIProps) { 
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
            <button
              type="button"
              aria-expanded={attributeNameMenuOpen}
              aria-controls="attribute-name-menu"
              aria-haspopup="true"
              onClick={() => setAttributeNameMenuOpen(!attributeNameMenuOpen)}
            >
              {currentAttributeName}
            </button>
            <div
              id="attribute-name-menu"
              role="menu"
              className={clsx(
                styles.menu,
                attributeNameMenuOpen && styles.open
              )}
            >
              {availableAttributes.map((attribute) => (
                <Label key={attribute} className={styles.attributeSelectLabel}>
                  <input
                    type="radio"
                    name="affectedAttribute"
                    value={attribute}
                    checked={currentAttributeName === attribute}
                    onChange={() => {
                      setCurrentAttributeName(attribute);
                      setAttributeNameMenuOpen(false);
                    }}
                  />
                  {attribute}
                </Label>
              ))}
            </div>
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
                      onChange={() => handleSetAttributeStrength(strengthKey)}
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
          onClick={handleAddAffectedAttribute}
          disabled={currentAttributeName === NO_AVAILABLE_ATTRIBUTES_TEXT}
        >
          ADD
        </button>
      </div>
    </fieldset>
  );
}