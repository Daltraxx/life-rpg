"use client";

import styles from "./styles.module.css";
import Heading from "../../../../JSXWrappers/Heading";
import { Label } from "@/app/ui/JSXWrappers/TextWrappers";
import { useState } from "react";

// Temporary test quests data
const TEST_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

export default function QuestsWidget() {
  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36">
        Add Quests
      </Heading>

      <Label size="24" className={styles.label} htmlFor="add-quest">
        Quest Name:
      </Label>
      <input type="text" id="add-quest" className={styles.addQuestInput} />

      <fieldset className={styles.affectedAttributesFieldset}>
        <legend className={styles.label}>Affected Attributes</legend>

        {/* Affected Attribute */}
        <button className={styles.attributeSelectMenuToggle}>Select Attributes</button>
        <div className={styles.attributeSelectContainer}>
          {TEST_ATTRIBUTES.map((attribute) => (
            <Label key={attribute} className={styles.attributeSelectLabel}>
              <input type="radio" name="affectedAttribute" value={attribute} />
              {attribute}
            </Label>
          ))}
        </div>
        
        {/* Amount attribute is affected by quest */}
        <button className={styles.attributeStrengthMenuToggle}>normal</button>
        <div className={styles.attributeStrengthContainer}>
          <Label>
            <input type="radio" name="attributeStrength" value="normal" />
            normal
          </Label>
          <Label>
            <input type="radio" name="attributeStrength" value="plus" />
            +
          </Label>
          <Label>
            <input type="radio" name="attributeStrength" value="plusPlus" />
            ++
          </Label>
        </div>

        {/* Add attribute to quest button */}
        <button className={styles.addAttributeButton}>ADD</button>
      </fieldset>
    </section>
  );
}
