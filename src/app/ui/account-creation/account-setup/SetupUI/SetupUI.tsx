"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./QuestsWidget/vars.module.css";
import clsx from "clsx";
import { useState } from "react";

const INITIAL_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

export default function SetupUI() {
  const [availableAttributes, setAvailableAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);

  const handleAddAttribute = (attribute: string) => {
    setAvailableAttributes((prev) => [...prev, attribute]);
  };

  const handleDeleteAttribute = (attribute: string) => {
    setAvailableAttributes((prev) => prev.filter((attr) => attr !== attribute));
  };

  return (
    <Bounded>
      <div className={styles.uiContainer}>
        <AttributeWidget
          className={styles.attributeWidget}
          attributes={availableAttributes}
          addAttribute={handleAddAttribute}
          deleteAttribute={handleDeleteAttribute}
        />
        <QuestsWidget
          availableAttributes={availableAttributes}
          className={clsx(styles.questsWidget, cssVars.questsWidgetVars)}
        />
      </div>
    </Bounded>
  );
}
