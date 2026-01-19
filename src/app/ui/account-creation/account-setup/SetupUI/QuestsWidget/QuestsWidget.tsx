"use client";

import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import {
  Label,
  ListItem,
  Paragraph,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { useState } from "react";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import AddAffectedAttributeUI from "./AddAffectedAttributeUI/AddAffectedAttributeUI";
import AffectedAttributesTable from "./AffectedAttributesTable/AffectedAttributesTable";
import clsx from "clsx";
import {
  createAffectedAttribute,
  type Quest,
  createQuest,
} from "@/utils/types/AttributesAndQuests";
import type { AffectedAttributeManager } from "@/utils/hooks/useAffectedAttributeManager";
import { createQuestNameSchema } from "@/utils/validations/questName";

const REQUIRED_ATTRIBUTE = "Discipline";

interface QuestsWidgetProps {
  affectedAttributeManager: AffectedAttributeManager;
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  className?: string;
}

export default function QuestsWidget({
  affectedAttributeManager,
  quests,
  addQuest,
  className,
}: QuestsWidgetProps) {
  const [newQuestName, setNewQuestName] = useState<string>("");
  const [questErrors, setQuestErrors] = useState<string[]>([]);

  const {
    selectedAttributes,
    actions: { deleteAffectedAttribute, resetAffectedAttributeSelectionUI },
  } = affectedAttributeManager;

  const handleCreateQuest = () => {
    // TODO: Add proper error handling and user feedback
    const questNameSchema = createQuestNameSchema(quests);
    const validationResult = questNameSchema.safeParse(newQuestName);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message);
      setQuestErrors(errors);
      return;
    }

    // Add required attribute at base strength if user hasn't specified it
    const affectedAttributes = [...selectedAttributes];
    if (!affectedAttributes.some((attr) => attr.name === REQUIRED_ATTRIBUTE)) {
      affectedAttributes.push(
        createAffectedAttribute(REQUIRED_ATTRIBUTE, "normal"),
      );
    }

    addQuest(createQuest(validationResult.data, affectedAttributes));

    // Reset UI state
    setQuestErrors([]);
    setNewQuestName("");
    resetAffectedAttributeSelectionUI();
  };

  const handleOnChangeNewQuestName = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setNewQuestName(e.target.value);
    if (questErrors.length > 0) {
      setTimeout(() => { 
        const questNameSchema = createQuestNameSchema(quests);
        const validationResult = questNameSchema.safeParse(e.target.value);
        if (!validationResult.success) {
          const errors = validationResult.error.issues.map((err) => err.message);
          setQuestErrors(errors);
        } else {
          setQuestErrors([]);
        }
      }, 300); // Debounce to avoid rapid state updates
    }
  }

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
          onChange={handleOnChangeNewQuestName}
        />
      </div>
      {questErrors.length > 0 && (
        <ul className={styles.errorList}>
          {questErrors.map((error, index) => (
            <ListItem key={index} className={styles.errorItem} size="20">
              {error}
            </ListItem>
          ))}
        </ul>
      )}

      {/* UI FOR ADDING THE QUEST'S AFFECTED ATTRIBUTES */}
      <AddAffectedAttributeUI
        affectedAttributeManager={affectedAttributeManager}
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
