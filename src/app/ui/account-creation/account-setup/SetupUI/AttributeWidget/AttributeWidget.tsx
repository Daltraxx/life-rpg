"use client";

import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from "../../../../JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { useState } from "react";
import AttributeListItem from "./AttributeList/AttributeListItem";

const INITIAL_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

export default function AttributeWidget() {
  const [attributes, setAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);
  const [attributeSet] = useState(() => new Set(INITIAL_ATTRIBUTES));
  const [newAttribute, setNewAttribute] = useState<string>("");
  const [addAttributeError, setAddAttributeError] = useState("");

  const handleAddAttribute = (attribute: string) => {
    const trimmedAttribute = attribute.trim();
    const newAttribute =
      trimmedAttribute.charAt(0).toUpperCase() + trimmedAttribute.slice(1);
    if (newAttribute.length === 0) {
      setAddAttributeError("Please enter an attribute.");
      return;
    }
    if (attributeSet.has(newAttribute)) {
      setAddAttributeError("Attribute already exists.");
      return;
    }
    setAddAttributeError("");
    attributeSet.add(newAttribute);
    setAttributes(Array.from(attributeSet));
    setNewAttribute("");
  };

  const handleDeleteAttribute = (attribute: string) => {
    attributeSet.delete(attribute);
    setAttributes(Array.from(attributeSet));
  };

  const attributeList = attributes.map((attribute) => (
    <AttributeListItem
      key={attribute}
      attribute={attribute}
      onDelete={handleDeleteAttribute}
    />
  ));

  return (
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36">
        Add Attributes
      </Heading>

      <div className={styles.addAttributeContainer}>
        <Label
          htmlFor="add-attribute"
          size="20"
          className={styles.addAttributeLabel}
        >
          Attribute Name:
        </Label>
        <div className={styles.addAttributeField}>
          <input
            type="text"
            id="add-attribute"
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddAttribute(newAttribute);
              }
            }}
            aria-describedby="attribute-error"
          />
          <button
            type="button"
            className={styles.addAttributeButton}
            onClick={() => handleAddAttribute(newAttribute)}
          >
            ADD
          </button>
        </div>
        {addAttributeError && (
          <p id="attribute-error" className={styles.attributeError}>
            {addAttributeError}
          </p>
        )}
      </div>

      <div>
        <Heading as="h4" size="24">
          Current Attributes
        </Heading>
        <ul>{attributeList}</ul>
      </div>
    </section>
  );
}
