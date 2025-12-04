"use client";

import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from "../../../JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { useState } from "react";
import AttributeListItem from "./AttributeList/AttributeListItem";

const INITIAL_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

const attributeSet = new Set(INITIAL_ATTRIBUTES);

export default function AttributeWidget() {
  const [attributes, setAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);
  const [nextAttributeKey, setNextAttributeKey] = useState<number>(
    INITIAL_ATTRIBUTES.length
  );

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
          <input type="text" id="add-attribute" />
          <button type="button" className={styles.addAttributeButton}>
            ADD
          </button>
        </div>
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
