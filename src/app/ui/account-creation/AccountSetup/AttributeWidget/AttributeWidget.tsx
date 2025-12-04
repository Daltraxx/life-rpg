"use client";

import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label, ListItem } from "../../../JSXWrappers/TextWrappers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.css";
import { useState } from "react";

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

  const attributeList = attributes.map((attribute) => (
    <ListItem key={attribute} className={styles.attributeItem} size="24">
      <button aria-label={`Remove ${attribute}`} type="button" className={styles.removeAttributeButton}>
        <FontAwesomeIcon
          icon={faRectangleXmark}
          className={styles.removeAttributeIcon}
          aria-hidden="true"
        />
      </button>
      {attribute}
    </ListItem>
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
