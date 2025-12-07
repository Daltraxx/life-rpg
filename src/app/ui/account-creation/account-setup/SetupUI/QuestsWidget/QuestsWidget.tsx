"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import { useEffect, useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import { set } from "zod";

type AttributeStrength = "normal" | "plus" | "plusPlus";

interface AffectedAttribute {
  name: string;
  strength: AttributeStrength;
}

class AffectedAttribute implements AffectedAttribute {
  constructor(name: string, strength: AttributeStrength) {
    this.name = name;
    this.strength = strength;
  }
}

interface Quest {
  name: string;
  affectedAttributes: AffectedAttribute[];
}

class Quest implements Quest {
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
const NO_AVAILABLE_ATTRIBUTES_TEXT = "No Attributes Available";

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

  const handleAddAffectedAttribute = () => {
    // TODO: Add proper error handling and user feedback
    if (selectedAttributes.some((attr) => attr.name === currentAttributeName)) {
      return;
    }
    setAvailableAttributes((prevAvailable) =>
      prevAvailable.filter((attr) => attr !== currentAttributeName)
    );
    setCurrentAttributeName(
      availableAttributes.find(
        (attr) => attr !== currentAttributeName
      ) || NO_AVAILABLE_ATTRIBUTES_TEXT
    );
    setSelectedAttributes((prevSelected) => [
      ...prevSelected,
      new AffectedAttribute(currentAttributeName, currentAttributeStrength),
    ]);
  };

  const handleDeleteAffectedAttribute = (attributeName: string) => {
    setSelectedAttributes((prevSelected) =>
      prevSelected.filter((attr) => attr.name !== attributeName)
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

  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36" color="blue-700">
        Add Quests
      </Heading>

      {/* Input for creating quest name */}
      <div className={styles.addQuestContainer}>
        <Label size="24" className={styles.label} htmlFor="add-quest">
          Quest Name:
        </Label>
        <input
          type="text"
          id="add-quest"
          className={styles.addQuestInput}
          value={newQuestName}
          onChange={(e) => setNewQuestName(e.target.value)}
        />
      </div>

      {/* UI for adding the quest's affected attributes */}
      <fieldset className={styles.affectedAttributesFieldset}>
        <legend className={styles.affectedAttributesLegend}>Affected Attributes:</legend>

        {/* Affected Attribute */}
        <button className={styles.attributeSelectMenuToggle} type="button">
          {currentAttributeName}
        </button>
        <div className={styles.attributeSelectContainer}>
          {availableAttributes.map((attribute) => (
            <Label key={attribute} className={styles.attributeSelectLabel}>
              <input
                type="radio"
                name="affectedAttribute"
                value={attribute}
                checked={currentAttributeName === attribute}
                onChange={() => setCurrentAttributeName(attribute)}
              />
              {attribute}
            </Label>
          ))}
        </div>

        {/* Amount attribute is affected by quest */}
        <button className={styles.attributeStrengthMenuToggle} type="button">
          {strengthDisplayMap[currentAttributeStrength]}
        </button>
        <div className={styles.attributeStrengthContainer}>
          <Label>
            <input
              type="radio"
              name="attributeStrength"
              value="normal"
              checked={currentAttributeStrength === "normal"}
              onChange={(e) =>
                setCurrentAttributeStrength(e.target.value as AttributeStrength)
              }
            />
            normal
          </Label>
          <Label>
            <input
              type="radio"
              name="attributeStrength"
              value="plus"
              checked={currentAttributeStrength === "plus"}
              onChange={(e) =>
                setCurrentAttributeStrength(e.target.value as AttributeStrength)
              }
            />
            +
          </Label>
          <Label>
            <input
              type="radio"
              name="attributeStrength"
              value="plusPlus"
              checked={currentAttributeStrength === "plusPlus"}
              onChange={(e) =>
                setCurrentAttributeStrength(e.target.value as AttributeStrength)
              }
            />
            ++
          </Label>
        </div>

        {/* Add attribute to quest button */}
        <button
          className={styles.addAttributeButton}
          type="button"
          onClick={handleAddAffectedAttribute}
        >
          ADD
        </button>
      </fieldset>

      {/* Affected attributes display table */}
      <table className={styles.affectedAttributesTable}>
        <tbody>
          {selectedAttributes.map((attribute) => (
            <tr key={attribute.name} className={styles.affectedAttributeRow}>
              <td className={styles.affectedAttributeName}>{attribute.name}</td>
              <td className={styles.affectedAttributeStrength}>
                {strengthDisplayMap[attribute.strength]}
              </td>
              <td className={styles.deleteAttributeButton}>
                <ButtonWrapper
                  className={styles.deleteAttributeButton}
                  onClick={() => handleDeleteAffectedAttribute(attribute.name)}
                  type="button"
                >
                  DELETE
                </ButtonWrapper>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create quest button */}
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
