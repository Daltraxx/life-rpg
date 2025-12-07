"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import { useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";

// Temporary test quests data
const TEST_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

export default function QuestsWidget() {
  const [affectedAttributes, setAffectedAttributes] = useState<
    [string, string][]
  >([["Discipline", "normal"]]);
  const [selectedAttribute, setSelectedAttribute] = useState<string>("Empty");
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
          {selectedAttribute}
        </button>
        <div className={styles.attributeSelectContainer}>
          {TEST_ATTRIBUTES.map((attribute) => (
            <Label key={attribute} className={styles.attributeSelectLabel}>
              <input
                type="radio"
                name="affectedAttribute"
                value={attribute}
                checked={selectedAttribute === attribute}
                onChange={() => setSelectedAttribute(attribute)}
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
            <input type="radio" name="attributeStrength" value="normal" />
            normal
          </Label>
          <Label>
            <input type="radio" name="attributeStrength" value="plus" />+
          </Label>
          <Label>
            <input type="radio" name="attributeStrength" value="plusPlus" />
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
        {affectedAttributes.map((attribute) => (
          <tr key={attribute[0]} className={styles.affectedAttributeRow}>
            <td className={styles.affectedAttributeName}>{attribute[0]}</td>
            <td className={styles.affectedAttributeStrength}>{attribute[1]}</td>
            <td className={styles.deleteAttributeButton}>
              <ButtonWrapper type="button">DELETE</ButtonWrapper>
            </td>
          </tr>
        ))}
      </table>

      {/* Create quest button */}
      <ButtonWrapper className={styles.createQuestButton} color="blue-700">
        CREATE QUEST
      </ButtonWrapper>
    </section>
  );
}
