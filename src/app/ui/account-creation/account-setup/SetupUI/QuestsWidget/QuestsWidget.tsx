"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import { useEffect, useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";

type AttributeStrength = "normal" | "plus" | "plusPlus";

class AffectedAttribute {
  constructor(public name: string, public strength: AttributeStrength) {
    this.name = name;
    this.strength = strength;
  }
}

class Quest {
  constructor(
    public name: string,
    public affectedAttributes: AffectedAttribute[]
  ) {
    this.name = name;
    this.affectedAttributes = affectedAttributes;
  }
}

const REQUIRED_ATTRIBUTE = "Discipline";

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
    availableAttributes[0]
  );
  const [currentAttributeStrength, setCurrentAttributeStrength] =
    useState<AttributeStrength>("normal");
  const [currentAttribute, setCurrentAttribute] = useState<AffectedAttribute>(
    new AffectedAttribute(currentAttributeName, currentAttributeStrength)
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    AffectedAttribute[]
  >([]);

  useEffect(() => {
    setCurrentAttribute(
      new AffectedAttribute(currentAttributeName, currentAttributeStrength)
    );
  }, [currentAttributeName, currentAttributeStrength]);

  const handleAddAffectedAttribute = () => {
    setSelectedAttributes((prevSelected) => [
      ...prevSelected,
      currentAttribute,
    ]);
  };

  const handleDeleteAffectedAttribute = (attributeName: string) => {
    setSelectedAttributes((prevSelected) =>
      prevSelected.filter((attr) => attr.name !== attributeName)
    );
  };

  const handleCreateQuest = () => {
    const trimmedQuestName = newQuestName.trim();
    // TODO: Add proper error handling and user feedback
    if (trimmedQuestName.length === 0) {
      return;
    }
    if (selectedAttributes.length === 0) {
      return;
    }
    if (quests.some((quest) => quest.name === trimmedQuestName)) {
      return;
    }

    // Add required attribute at base strength if user hasn't specified it
    const affectedAttributes = selectedAttributes;
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
    console.log("Quest created:", trimmedQuestName, affectedAttributes);
  };

  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36" color="blue-700">
        Add Quests
      </Heading>

      {/* Input for creating quest name */}
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

      {/* UI for adding the quest's affected attributes */}
      <fieldset className={styles.affectedAttributesFieldset}>
        <legend className={styles.label}>Affected Attributes</legend>

        {/* Affected Attribute */}
        <button className={styles.attributeSelectMenuToggle} type="button">
          {currentAttribute.name}
        </button>
        <div className={styles.attributeSelectContainer}>
          {availableAttributes.map((attribute) => (
            <Label key={attribute} className={styles.attributeSelectLabel}>
              <input
                type="radio"
                name="affectedAttribute"
                value={attribute}
                checked={currentAttribute.name === attribute}
                onChange={() => setCurrentAttributeName(attribute)}
              />
              {attribute}
            </Label>
          ))}
        </div>

        {/* Amount attribute is affected by quest */}
        <button className={styles.attributeStrengthMenuToggle} type="button">
          normal
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
                {attribute.strength}
              </td>
              <td className={styles.deleteAttributeButton}>
                <ButtonWrapper
                  className={styles.deleteAttributeButton}
                  data-attribute-name={attribute.name}
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
