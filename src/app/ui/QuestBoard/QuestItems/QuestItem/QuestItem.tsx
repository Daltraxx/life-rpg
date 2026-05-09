"use client";

import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { sortAffectedAttributes } from "@/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/utils/helpers/getAttributeDisplayString";
import { useRef, useEffect } from "react";
import clsx from "clsx";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { SetupQuest } from "@/utils/types/accountSetup/SetupAttributesAndQuests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark, faGem } from "@fortawesome/free-regular-svg-icons";

interface QuestItemProps {
  quest: SetupQuest;
  className?: string;
}

export default function QuestItem({
  quest,
  className,
}: QuestItemProps) {
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
        styles.questItem, styles.questItemViewOnly,
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
          onClick={() => null}
          aria-label={`Complete quest ${quest.name}`}
        >
          COMPLETE QUEST
        </ButtonWrapper>
        {/* larger screens */}
        <button
          type="button"
          onClick={() => null}
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
