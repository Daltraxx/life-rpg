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
import type { DailyQuestManager } from "@/utils/hooks/useDailyQuestManager";

interface QuestItemProps {
  quest: DailyQuest;
  dailyQuestManager: DailyQuestManager;
  className?: string;
}

export default function QuestItem({
  quest,
  dailyQuestManager,
  className,
}: QuestItemProps) {
  const attributesString = sortAffectedAttributes(quest.affectedAttributes)
    .map((attr) => getAttributeDisplayString(attr))
    .join(", ");

  const { completeQuest, undoCompleteQuest } = dailyQuestManager.actions;
  const handleCompletionToggle = () => {
    if (quest.isCompleted) {
      undoCompleteQuest(quest.id);
    } else {
      completeQuest(quest.id);
    }
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
          aria-label={`Complete quest ${quest.name}`}
        >
          COMPLETE QUEST
        </ButtonWrapper>
        {/* larger screens */}
        <button
          type="button"
          onClick={() => handleCompletionToggle()}
          className={clsx(styles.completeQuestButton, styles.largerScreenOnly)}
          aria-label={`Complete quest ${quest.name}`}
        >
          <FontAwesomeIcon
            icon={faGem}
            className={styles.completeQuestIcon}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
