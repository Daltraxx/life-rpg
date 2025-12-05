"use client";

import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from "../../../../JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { JSX, useState } from "react";
import AttributeListItem from "./AttributeList/AttributeListItem";

const INITIAL_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

/**
 * AttributeWidget component for managing custom attributes in account setup.
 *
 * Allows users to add and delete custom attributes with validation to prevent
 * empty entries and duplicates. Maintains a set of attributes and displays them
 * in a list format.
 *
 * @component
 * @returns {JSX.Element} A section containing an attribute input form and a list
 *                        of current attributes with delete functionality.
 *
 * @example
 * // Basic usage in account setup flow
 * <AttributeWidget />
 *
 * @remarks
 * - Uses a Set for efficient duplicate checking
 * - Automatically capitalizes the first letter of attribute names
 * - Displays validation errors for empty or duplicate entries
 * - Enter key and button click both trigger attribute addition
 * - Maintains accessibility with proper aria-describedby and htmlFor attributes
 */
export default function AttributeWidget(): JSX.Element {
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
