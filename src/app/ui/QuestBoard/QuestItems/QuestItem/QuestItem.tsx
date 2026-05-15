"use client";

import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { sortAffectedAttributes } from "@/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/utils/helpers/getAttributeDisplayString";
import clsx from "clsx";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { DailyQuest } from "@/utils/types/DailyQuest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-regular-svg-icons";
import { faRotateLeft, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import type { DailyQuestManager } from "@/utils/hooks/useDailyQuestManager";

/**
 * Props for the QuestItem component.
 * @interface QuestItemProps
 */
interface QuestItemProps {
  /** The daily quest to display */
  quest: DailyQuest;
  /** Manager for quest actions and state */
  dailyQuestManager: DailyQuestManager;
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Displays a single daily quest item with its details and completion button.
 *
 * @component
 * @param {QuestItemProps} props - The component props
 * @param {DailyQuest} props.quest - The quest to render
 * @param {DailyQuestManager} props.dailyQuestManager - Manager for quest actions
 * @param {string} [props.className] - Optional additional CSS classes
 * @returns {JSX.Element} The rendered quest item
 *
 * @example
 * <QuestItem
 *   quest={myQuest}
 *   dailyQuestManager={questManager}
 *   className="custom-class"
 * />
 */
export default function QuestItem({
  quest,
  dailyQuestManager,
  className,
}: QuestItemProps) {
  const attributesString = sortAffectedAttributes(quest.affectedAttributes)
    .map((attr) => getAttributeDisplayString(attr))
    .join(", ");

  const { completeQuest, undoCompleteQuest } = dailyQuestManager.actions;

  /**
   * Handles toggling the quest completion state.
   * Completes or undoes completion based on current state.
   */
  const handleCompletionToggle = () => {
    if (quest.isCompleted === "true") {
      if (!quest.completedQuestId) {
        console.error(
          `Cannot undo completion for quest "${quest.name}" because completedQuestId is null.`,
        );
        return;
      }
      undoCompleteQuest(quest.id, quest.completedQuestId);
    } else {
      completeQuest(quest.id);
    }
  };

  /**
   * Gets the appropriate icon for the quest action button.
   * @returns {IconDefinition} The Font Awesome icon to display
   */
  const getQuestActionIcon = () => {
    if (quest.isCompleted === "pending") {
      return faEllipsis;
    } else if (quest.isCompleted === "true") {
      return faRotateLeft;
    } else {
      return faGem;
    }
  };

  /**
   * Gets the appropriate text for the quest action button.
   * @returns {string} The button text to display
   */
  const getQuestActionText = () => {
    if (quest.isCompleted === "pending") {
      return "Updating...";
    } else if (quest.isCompleted === "true") {
      return "UNDO COMPLETE QUEST";
    }
    return "COMPLETE QUEST";
  };

  // TODO: Render different styling for completed vs incomplete quests (e.g. grayed out, strikethrough, etc.)
  // TODO: Consider rendering table on larger screens for better accessibility
  return (
    <div
      className={clsx(styles.questItem, styles.questItemViewOnly, className)}
    >
      {/* QUEST NAME */}
      <div className={styles.questDetails}>
        <Heading
          as="h4"
          color="background"
          className={styles.questName}
          aria-label={`Quest name: ${quest.name}`}
        >
          {quest.name}
        </Heading>

        {/* ATTRIBUTES */}
        <Paragraph
          size="24-responsive"
          color="background"
          aria-label={`Affected attributes: ${attributesString}`}
        >
          {attributesString}
        </Paragraph>

        {/* STREAK */}
        <Paragraph
          size="24-responsive"
          color="background"
          aria-label="Quest streak: 0"
        >
          <span className={styles.smallScreenOnly}>Streak: </span>0
        </Paragraph>

        {/* STRENGTH */}
        <Paragraph
          size="24-responsive"
          color="background"
          aria-label="Quest strength: 0 — E"
        >
          <span className={styles.smallScreenOnly}>Strength: </span>0 — E
        </Paragraph>

        {/* EXPERIENCE */}
        <div className={styles.experienceSection}>
          <Paragraph
            size="24-responsive"
            color="background"
            className={styles.experienceValue}
            aria-label={`Experience gained: ${quest.experienceShare}`}
          >
            <span className={styles.smallScreenOnly}>Exp. Gained: </span>
            {quest.experienceShare}
          </Paragraph>
        </div>

        {/* COMPLETE BUTTON */}
        {/* small screens */}
        <ButtonWrapper
          className={clsx(styles.completeQuestButton, styles.smallScreenOnly)}
          color="background"
          onClick={() => handleCompletionToggle()}
          disabled={quest.isCompleted === "pending"}
          aria-label={
            quest.isCompleted === "true"
              ? `Undo complete quest ${quest.name}`
              : `Complete quest ${quest.name}`
          }
        >
          {getQuestActionText()}
        </ButtonWrapper>
        {/* larger screens */}
        <button
          type="button"
          onClick={() => handleCompletionToggle()}
          className={clsx(styles.completeQuestButton, styles.largerScreenOnly)}
          disabled={quest.isCompleted === "pending"}
          aria-label={
            quest.isCompleted === "true"
              ? `Undo complete quest ${quest.name}`
              : `Complete quest ${quest.name}`
          }
        >
          <FontAwesomeIcon
            icon={getQuestActionIcon()}
            className={styles.completeQuestIcon}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
