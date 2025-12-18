"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./QuestsWidget/vars.module.css";
import clsx from "clsx";
import { useState } from "react";
import type {
  Quest,
  Attribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import QuestBoard from "./QuestBoard/QuestBoard";

const INITIAL_ATTRIBUTES: Attribute[] = [
  { name: "Discipline", order: 0 },
  { name: "Vitality", order: 1 },
  { name: "Intelligence", order: 2 },
  { name: "Fitness", order: 3 },
];

export default function SetupUI() {
  // Manage available attributes state
  const [availableAttributes, setAvailableAttributes] =
    useState<Attribute[]>(INITIAL_ATTRIBUTES);
  const [nextAttributeOrderNumber, setNextAttributeOrderNumber] =
    useState<number>(INITIAL_ATTRIBUTES.length);
  const handleAddAttribute = (attribute: Attribute) => {
    setAvailableAttributes((prev) => [...prev, attribute]);
    setNextAttributeOrderNumber((prev) => prev + 1);
  };
  const handleDeleteAttribute = (attribute: Attribute) => {
    const updatedAttributes = availableAttributes.filter(
      (attr) => attribute.name !== attr.name
    );
    for (let i = attribute.order; i < updatedAttributes.length; i++) {
      updatedAttributes[i].order -= 1;
    }
    setAvailableAttributes(updatedAttributes);
    setNextAttributeOrderNumber((prev) => prev - 1);
  };

  // Manage quests state
  const [quests, setQuests] = useState<Quest[]>([]);
  const [nextQuestOrderNumber, setNextQuestOrderNumber] = useState<number>(0);
  const handleAddQuest = (quest: Quest) => {
    setQuests((prev) => [...prev, quest]);
    setNextQuestOrderNumber((prev) => prev + 1);
  };

  return (
    <Bounded innerClassName={styles.setupContainer}>
      <div className={styles.widgetContainer}>
        <AttributeWidget
          className={styles.attributeWidget}
          attributes={availableAttributes}
          nextAttributeOrderNumber={nextAttributeOrderNumber}
          addAttribute={handleAddAttribute}
          deleteAttribute={handleDeleteAttribute}
        />
        <QuestsWidget
          availableAttributes={availableAttributes}
          quests={quests}
          addQuest={handleAddQuest}
          nextQuestOrderNumber={nextQuestOrderNumber}
          className={clsx(styles.questsWidget, cssVars.questsWidgetVars)}
        />
      </div>
      <QuestBoard />
    </Bounded>
  );
}
