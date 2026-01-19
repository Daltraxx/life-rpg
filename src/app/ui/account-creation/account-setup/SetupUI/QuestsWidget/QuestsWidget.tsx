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

/**
 * QuestsWidget Component
 *
 * A form component for creating new quests with associated attributes.
 * Allows users to input a quest name, select affected attributes, and create
 * the quest with validation feedback.
 *
 * @component
 * @param {QuestsWidgetProps} props - Component props
 * @param {AffectedAttributeManager} props.affectedAttributeManager - Manager for handling attribute selection and state
 * @param {Quest[]} props.quests - Array of existing quests used for name validation
 * @param {(quest: Quest) => void} props.addQuest - Callback function to add a new quest
 * @param {string} [props.className] - Optional CSS class name for styling the container
 *
 * @returns {React.ReactElement} The rendered quests widget section
 *
 * @example
 * ```tsx
 * <QuestsWidget
 *   affectedAttributeManager={manager}
 *   quests={questList}
 *   addQuest={handleAddQuest}
 *   className="custom-class"
 * />
 * ```
 *
 * @remarks
 * - Automatically adds the REQUIRED_ATTRIBUTE (Discipline) at normal strength if not specified
 * - Validates quest names against existing quests to prevent duplicates
 * - Implements debounced validation on input change to improve performance
 * - Resets all UI state after successful quest creation
 * - Uses accessible ARIA attributes for error messages and live regions
 */
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

  const handleOnChangeNewQuestName = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewQuestName(e.target.value);
    if (questErrors.length > 0) {
      setTimeout(() => {
        const questNameSchema = createQuestNameSchema(quests);
        const validationResult = questNameSchema.safeParse(e.target.value);
        if (!validationResult.success) {
          const errors = validationResult.error.issues.map(
            (err) => err.message,
          );
          setQuestErrors(errors);
        } else {
          setQuestErrors([]);
        }
      }, 300); // Debounce to avoid rapid state updates
    }
  };

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
          aria-describedby="quest-name-error"
          className={styles.addQuestInput}
          value={newQuestName}
          onChange={handleOnChangeNewQuestName}
        />
      </div>
      
      {/* QUEST NAME ERROR MESSAGES */}
      {questErrors.length > 0 && (
        <ul
          className={styles.errorList}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          id="quest-name-error"
        >
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
