"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label, Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import { useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import clsx from "clsx";

type AttributeStrength = "normal" | "plus" | "plusPlus";

class AffectedAttribute {
  public name: string;
  public strength: AttributeStrength;

  constructor(name: string, strength: AttributeStrength) {
    this.name = name;
    this.strength = strength;
  }
}

class Quest {
  public name: string;
  public affectedAttributes: AffectedAttribute[];

  constructor(name: string, affectedAttributes: AffectedAttribute[]) {
    this.name = name;
    this.affectedAttributes = affectedAttributes;
  }
}

const strengthDisplayMap: Record<AttributeStrength, string> = {
  normal: "normal",
  plus: "+",
  plusPlus: "++",
};

const REQUIRED_ATTRIBUTE = "Discipline";
const NO_AVAILABLE_ATTRIBUTES_TEXT = "N/A";

// Temporary test quests data
const TEST_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

export default function QuestsWidget() {
  // TODO: Implement error handling and validation for quest creation
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestName, setNewQuestName] = useState<string>("");
  const [availableAttributes, setAvailableAttributes] =
    useState<string[]>(TEST_ATTRIBUTES);
  const [currentAttributeName, setCurrentAttributeName] = useState<string>(
    availableAttributes[0] || NO_AVAILABLE_ATTRIBUTES_TEXT
  );
  const [currentAttributeStrength, setCurrentAttributeStrength] =
    useState<AttributeStrength>("normal");
  const [selectedAttributes, setSelectedAttributes] = useState<
    AffectedAttribute[]
  >([]);

  const [attributeNameMenuOpen, setAttributeNameMenuOpen] =
    useState<boolean>(false);
  const [attributeStrengthMenuOpen, setAttributeStrengthMenuOpen] =
    useState<boolean>(false);

  const handleSetAttributeStrength = (strength: AttributeStrength) => {
    setCurrentAttributeStrength(strength);
    setAttributeStrengthMenuOpen(false);
  };

  const handleAddAffectedAttribute = () => {
    // TODO: Add proper error handling and user feedback
    if (selectedAttributes.some((attr) => attr.name === currentAttributeName)) {
      return;
    }

    setAvailableAttributes((prevAvailable) => {
      const updatedAvailableAttributes = prevAvailable.filter(
        (attr) => attr !== currentAttributeName
      );
      setCurrentAttributeName(
        updatedAvailableAttributes[0] || NO_AVAILABLE_ATTRIBUTES_TEXT
      );
      return updatedAvailableAttributes;
    });

    setSelectedAttributes((prevSelected) => [
      ...prevSelected,
      new AffectedAttribute(currentAttributeName, currentAttributeStrength),
    ]);
  };

  const handleDeleteAffectedAttribute = (attributeName: string) => {
    setSelectedAttributes((prevSelected) =>
      prevSelected.filter((attr) => attr.name !== attributeName)
    );
    setAvailableAttributes((prevAvailable) => {
      const updatedAvailableAttributes = [...prevAvailable, attributeName];
      // Sort available attributes to maintain order
      return updatedAvailableAttributes.sort(
        (a, b) => TEST_ATTRIBUTES.indexOf(a) - TEST_ATTRIBUTES.indexOf(b)
      );
    });
    setCurrentAttributeName((prevCurrent) =>
      prevCurrent === NO_AVAILABLE_ATTRIBUTES_TEXT ? attributeName : prevCurrent
    );
  };

  const handleCreateQuest = () => {
    const trimmedQuestName = newQuestName.trim();
    const loweredQuestName = trimmedQuestName.toLowerCase();
    // TODO: Add proper error handling and user feedback
    if (trimmedQuestName.length === 0) {
      return;
    }
    if (selectedAttributes.length === 0) {
      return;
    }
    if (quests.some((quest) => quest.name.toLowerCase() === loweredQuestName)) {
      return;
    }

    // Add required attribute at base strength if user hasn't specified it
    const affectedAttributes = [...selectedAttributes];
    if (!affectedAttributes.some((attr) => attr.name === REQUIRED_ATTRIBUTE)) {
      affectedAttributes.push(
        new AffectedAttribute(REQUIRED_ATTRIBUTE, "normal")
      );
    }
    setQuests((prevQuests) => [
      ...prevQuests,
      new Quest(trimmedQuestName, affectedAttributes),
    ]);

    // Reset UI state
    setNewQuestName("");
    setSelectedAttributes([]);
    setAvailableAttributes(TEST_ATTRIBUTES);
    setCurrentAttributeName(TEST_ATTRIBUTES[0] || NO_AVAILABLE_ATTRIBUTES_TEXT);
    setCurrentAttributeStrength("normal");
  };

  // TODO: Add keyboard accessibility for dropdown menus
  // Consider using Radix UI or similar library for better accessibility

  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36" color="blue-700" className={styles.heading}>
        Add Quests
      </Heading>
      <Paragraph className={styles.description}>
        Create a new quest and specify which attributes it benefits. Discipline
        is automatically affected by all completed quests, but if it is an especially
        arduous or important task, you may specify a greater strength bonus.
      </Paragraph>

      <Label
        size="24"
        className={clsx(styles.label, styles.addQuestLabel)}
        htmlFor="add-quest"
      >
        Quest Name:
      </Label>
      <input
        type="text"
        id="add-quest"
        className={styles.addQuestInput}
        value={newQuestName}
        onChange={(e) => setNewQuestName(e.target.value)}
      />

      {/* UI FOR ADDING THE QUEST'S AFFECTED ATTRIBUTES */}
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
                  <Label
                    key={attribute}
                    className={styles.attributeSelectLabel}
                  >
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

      {/* AFFECTED ATTRIBUTES DISPLAY TABLE */}
      <table className={styles.affectedAttributesTable}>
        <tbody>
          {selectedAttributes.map((attribute) => (
            <tr key={attribute.name} className={styles.affectedAttributeRow}>
              <td
                className={clsx(
                  styles.affectedAttributeCell,
                  styles.affectedAttributeName
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
                    : null
                )}
              >
                {strengthDisplayMap[attribute.strength]}
              </td>
              <td className={clsx(styles.deleteAttributeButtonCell)}>
                <button
                  className={clsx(
                    styles.appendedButton,
                    styles.deleteAttributeButton
                  )}
                  onClick={() => handleDeleteAffectedAttribute(attribute.name)}
                  type="button"
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CREATE QUEST BUTTON */}
      <ButtonWrapper
        className={styles.createQuestButton}
        type="button"
        color="blue-700"
        onClick={handleCreateQuest}
      >
        CREATE QUEST
      </ButtonWrapper>
    </section>
  );
}
