"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label, Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import { useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import AddAffectedAttributeUI from "./AddAffectedAttributeUI/AddAffectedAttributeUI";
import AffectedAttributesTable from "./AffectedAttributesTable/AffectedAttributesTable";
import clsx from "clsx";
import useQuestAttributeSelection from "@/utils/hooks/useQuestAttributeSelection";
import {
  createAffectedAttribute,
  Quest,
  createQuest,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

const REQUIRED_ATTRIBUTE = "Discipline";
const NO_AVAILABLE_ATTRIBUTES_TEXT = "N/A";

interface QuestsWidgetProps {
  availableAttributes: string[];
  className?: string;
}

export default function QuestsWidget({ availableAttributes, className }: QuestsWidgetProps) {
  // TODO: Implement error handling and validation for quest creation
  // TODO: Persist quests to context/state management
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestName, setNewQuestName] = useState<string>("");

  const attributeSelection = useQuestAttributeSelection(
    availableAttributes,
    NO_AVAILABLE_ATTRIBUTES_TEXT
  );

  const { selectedAttributes, actions: attributeActions } = attributeSelection;

  const { deleteAffectedAttribute, resetAttributeSelectionUI } =
    attributeActions;

  const handleCreateQuest = () => {
    const trimmedQuestName = newQuestName.trim();
    const loweredQuestName = trimmedQuestName.toLowerCase();
    // TODO: Add proper error handling and user feedback
    if (trimmedQuestName.length === 0) {
      return;
    }
    if (selectedAttributes.length === 0) {
      return;
    }
    if (quests.some((quest) => quest.name.toLowerCase() === loweredQuestName)) {
      return;
    }

    // Add required attribute at base strength if user hasn't specified it
    const affectedAttributes = [...selectedAttributes];
    if (!affectedAttributes.some((attr) => attr.name === REQUIRED_ATTRIBUTE)) {
      affectedAttributes.push(
        createAffectedAttribute(REQUIRED_ATTRIBUTE, "normal")
      );
    }
    setQuests((prevQuests) => [
      ...prevQuests,
      createQuest(trimmedQuestName, affectedAttributes),
    ]);

    // Reset UI state
    setNewQuestName("");
    resetAttributeSelectionUI();
  };

  // TODO: Add keyboard accessibility for dropdown menus
  // Consider using Radix UI or similar library for better accessibility

  return (
    <section className={clsx(styles.widgetContainer, className)}>
      <Heading as="h3" size="36" color="blue-700" className={styles.heading}>
        Add Quests
      </Heading>
      <Paragraph className={styles.description}>
        Create a new quest and specify which attributes it benefits. Discipline
        is automatically affected by all completed quests, but if it is an
        especially arduous or important task, you may specify a greater strength
        bonus.
      </Paragraph>

      <div className={styles.addQuestNameContainer}>
        <Label
          size="24"
          className={clsx(styles.label, styles.addQuestLabel)}
          htmlFor="add-quest"
        >
          Quest Name:
        </Label>
        <input
          type="text"
          id="add-quest"
          className={styles.addQuestInput}
          value={newQuestName}
          onChange={(e) => setNewQuestName(e.target.value)}
        />
      </div>

      {/* UI FOR ADDING THE QUEST'S AFFECTED ATTRIBUTES */}
      <AddAffectedAttributeUI
        attributeSelection={attributeSelection}
        noAvailableAttributesText={NO_AVAILABLE_ATTRIBUTES_TEXT}
      />

      {/* AFFECTED ATTRIBUTES DISPLAY TABLE */}
      <AffectedAttributesTable
        selectedAttributes={selectedAttributes}
        onDeleteAttribute={deleteAffectedAttribute}
      />

      {/* CREATE QUEST BUTTON */}
      <ButtonWrapper
        className={styles.createQuestButton}
        type="button"
        color="blue-700"
        onClick={handleCreateQuest}
      >
        CREATE QUEST
      </ButtonWrapper>
    </section>
  );
}
