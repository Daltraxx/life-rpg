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
  const handleDeleteQuest = (quest: Quest) => {
    const updatedQuests = structuredClone(quests).filter(
      (q) => quest.name !== q.name
    );
    const deletedQuestOrder = quest.order;
    for (let i = deletedQuestOrder; i < updatedQuests.length; i++) {
      updatedQuests[i].order -= 1;
    }
    setQuests(updatedQuests);
    setNextQuestOrderNumber((prev) => prev - 1);
  };
  const handleQuestOrderChange = (quest: Quest, direction: "up" | "down") => {
    const index = quest.order;
    const updatedQuests = structuredClone(quests);
    if (direction === "up") {
      if (index === 0) return; // Already at the top
      // Swap with the quest above
      [updatedQuests[index - 1], updatedQuests[index]] = [
        updatedQuests[index],
        updatedQuests[index - 1],
      ];
      // Update order numbers
      updatedQuests[index - 1].order = index - 1;
      updatedQuests[index].order = index;
    } else {
      if (index === quests.length - 1) return; // Already at the bottom
      // Swap with the quest below
      [updatedQuests[index + 1], updatedQuests[index]] = [
        updatedQuests[index],
        updatedQuests[index + 1],
      ];
      // Update order numbers
      updatedQuests[index + 1].order = index + 1;
      updatedQuests[index].order = index;
    }
    setQuests(updatedQuests);
  };

  const handleExperiencePointValueChange = (
    quest: Quest,
    direction: "up" | "down"
  ) => {
    const updatedQuests = structuredClone(quests);
    const questToUpdate = updatedQuests[quest.order];
    if (direction === "up") {
      // Max experience points is 100
      questToUpdate.experiencePointValue = Math.min(
        100,
        questToUpdate.experiencePointValue + 1
      );
    } else {
      // Min experience points is 0
      questToUpdate.experiencePointValue = Math.max(
        0,
        questToUpdate.experiencePointValue - 1
      );
    }
    setQuests(updatedQuests);
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
      <QuestBoard
        quests={quests}
        onDeleteQuest={handleDeleteQuest}
        onQuestOrderChange={handleQuestOrderChange}
      />
    </Bounded>
  );
}
