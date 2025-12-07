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

// Temporary test quests data
const TEST_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

const TEST_SELECTED_ATTRIBUTES: AffectedAttribute[] = [
  new AffectedAttribute("Discipline", "normal"),
];

export default function QuestsWidget() {
  const [affectedAttributes, setAffectedAttributes] = useState<
    [string, string][]
  >([["Discipline", "normal"]]);
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
  >(TEST_SELECTED_ATTRIBUTES);

  useEffect(() => {
    setCurrentAttribute(
      new AffectedAttribute(currentAttributeName, currentAttributeStrength)
    );
  }, [currentAttributeName, currentAttributeStrength]);

  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36" color="blue-700">
        Add Quests
      </Heading>

      {/* Input for creating quest name */}
      <Label size="24" className={styles.label} htmlFor="add-quest">
        Quest Name:
      </Label>
      <input type="text" id="add-quest" className={styles.addQuestInput} />

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
              onChange={(e) =>
                setCurrentAttributeStrength(e.target.value as AttributeStrength)
              }
            />
            ++
          </Label>
        </div>

        {/* Add attribute to quest button */}
        <button className={styles.addAttributeButton} type="button">
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
                <ButtonWrapper type="button">DELETE</ButtonWrapper>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create quest button */}
      <ButtonWrapper className={styles.createQuestButton} color="blue-700">
        CREATE QUEST
      </ButtonWrapper>
    </section>
  );
}
