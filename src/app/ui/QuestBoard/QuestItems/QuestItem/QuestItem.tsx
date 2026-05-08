"use client";

import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { sortAffectedAttributes } from "@/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/utils/helpers/getAttributeDisplayString";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { SetupQuest } from "@/utils/types/accountSetup/SetupAttributesAndQuests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";

interface QuestItemProps {
  quest: SetupQuest;
  index: number;
  totalQuests: number;
  className?: string;
}

export default function QuestItem({
  quest,
  index,
  totalQuests,
  className,
}: QuestItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const attributesString = sortAffectedAttributes(quest.affectedAttributes)
    .map((attr) => getAttributeDisplayString(attr))
    .join(", ");

  // TODO: Consider rendering table on larger screens for better accessibility
  return (
    <div
      className={clsx(
        styles.questItem,
        isRemoving && styles.removing,
        className,
      )}
      ref={itemElementRef}
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
            aria-label={`Experience share: ${quest.experienceShare}`}
          >
            <span className={styles.smallScreenOnly}>Exp. Gained: </span>
            {quest.experienceShare}
          </Paragraph>
        </div>

        {/* COMPLETE BUTTON */}
        {/* small screens */}
        <ButtonWrapper
          className={clsx(styles.deleteQuestButton, styles.smallScreenOnly)}
          color="background"
          onClick={() => null}
          disabled={isRemoving}
          aria-label={`Complete quest ${quest.name}`}
        >
          DELETE QUEST
        </ButtonWrapper>
        {/* larger screens */}
        <button
          type="button"
          onClick={() => null}
          className={clsx(styles.deleteQuestButton, styles.largerScreenOnly)}
          aria-label={`Complete quest ${quest.name}`}
          disabled={isRemoving}
        >
          <FontAwesomeIcon
            icon={faRectangleXmark}
            className={styles.deleteQuestIcon}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
