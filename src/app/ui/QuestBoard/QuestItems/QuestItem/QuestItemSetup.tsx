"use client";

import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { sortAffectedAttributes } from "@/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/utils/helpers/getAttributeDisplayString";
import { useState, useRef, useEffect } from "react";
import {
  ChevronUpButton,
  ChevronDownButton,
} from "@/app/ui/Buttons/ChevronButtons/ChevronButtons";
import clsx from "clsx";
import useSetElementHeight from "@/utils/hooks/useSetElementHeight";
import useSetCSSProperty from "@/utils/hooks/useSetCSSProperty";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/utils/types/Quest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import useWindowWidth from "@/utils/hooks/useWindowWidth";
import useButtonHold from "@/utils/hooks/useButtonHold";
import {
  MIN_EXPERIENCE_POINTS_PER_QUEST,
  MAX_EXPERIENCE_POINTS_PER_QUEST,
} from "@/utils/constants/gameConstants";

const DELETE_ANIMATION_DURATION_MS = 500;

const MIN_EXPERIENCE_POINTS = MIN_EXPERIENCE_POINTS_PER_QUEST;
const MAX_EXPERIENCE_POINTS = MAX_EXPERIENCE_POINTS_PER_QUEST;

const HOLD_INITIAL_DELAY_MS = 300;
const HOLD_INTERVAL_MS = 100;

interface QuestItemSetupProps {
  quest: Quest;
  index: number;
  totalQuests: number;
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
  onExperienceShareChange: (
    quest: Quest,
    direction: "up" | "down",
  ) => void;
  className?: string;
}

/**
 * A setup component for displaying and managing an individual quest in the Quest Board setup screen.
 *
 * Provides UI controls for:
 * - Reordering quests with up/down chevron buttons
 * - Viewing quest details (name, affected attributes, streak, strength)
 * - Adjusting experience share with mouse hold or keyboard support
 * - Deleting the quest with a smooth removal animation
 *
 * The component handles responsive layout with different button styles for small vs larger screens.
 * Experience adjustment buttons support continuous increments via mouse hold or keyboard hold.
 *
 * @param {QuestItemSetupProps} props - Component props
 * @param {Quest} props.quest - The quest data to display and manage
 * @param {number} props.index - The index of the quest in the list (for ordering)
 * @param {number} props.totalQuests - The total number of quests in the list (for conditional UI)
 * @param {(quest: Quest) => void} props.onDeleteQuest - Callback for deleting a quest
 * @param {(quest: Quest, direction: "up" | "down") => void} props.onQuestOrderChange - Callback for changing quest order
 * @param {(quest: Quest, direction: "up" | "down") => void} props.onExperienceShareChange - Callback for changing experience share
 * @param {string} [props.className] - Optional additional class name for styling
 * @returns {JSX.Element} The rendered quest item setup component
 *
 * @example
 * ```tsx
 * <QuestItemSetup
 *   quest={questData}
 *   index={0}
 *   totalQuests={3}
 *   onDeleteQuest={handleDelete}
 *   onQuestOrderChange={handleReorder}
 *   onExperienceShareChange={handleExpChange}
 * />
 * ```
 */
export default function QuestItemSetup({
  quest,
  index,
  totalQuests,
  onDeleteQuest,
  onQuestOrderChange,
  onExperienceShareChange,
  className,
}: QuestItemSetupProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemElementRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteClick = () => {
    setIsRemoving(true);
    // Wait for animation to complete before calling onDeleteQuest
    timeoutRef.current = setTimeout(() => {
      onDeleteQuest(quest);
    }, DELETE_ANIMATION_DURATION_MS);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle mouse hold for increasing/decreasing experience points
  const {
    handleMouseDown: startIncreasingPointsOnMouseHold,
    handleMouseUpOrLeave: stopIncreasingPointsOnMouseHold,
    handleKeyDown: startIncreasingPointsOnKeyHold,
    handleKeyUp: stopIncreasingPointsOnKeyHold,
  } = useButtonHold(HOLD_INITIAL_DELAY_MS, {
    onHold: () => {
      onExperienceShareChange(quest, "up");
    },
    holdInterval: HOLD_INTERVAL_MS,
  });

  const {
    handleMouseDown: startDecreasingPointsOnMouseHold,
    handleMouseUpOrLeave: stopDecreasingPointsOnMouseHold,
    handleKeyDown: startDecreasingPointsOnKeyHold,
    handleKeyUp: stopDecreasingPointsOnKeyHold,
  } = useButtonHold(HOLD_INITIAL_DELAY_MS, {
    onHold: () => {
      onExperienceShareChange(quest, "down");
    },
    holdInterval: HOLD_INTERVAL_MS,
  });

  // Set CSS variable for item height for animation purposes on deletion
  const setItemHeight = useSetElementHeight();
  const setCSSProperty = useSetCSSProperty(
    "transition-duration",
    `${DELETE_ANIMATION_DURATION_MS}ms`,
  );
  useEffect(() => {
    if (itemElementRef.current) {
      setItemHeight(itemElementRef.current);
      setCSSProperty(itemElementRef.current);
    }
  }, [setItemHeight, setCSSProperty]);

  // Reset height CSS variable on window width change to accommodate responsive layout
  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (itemElementRef.current) {
      // Allow element to resize naturally before measuring height
      setItemHeight(itemElementRef.current, true);
      requestAnimationFrame(() => {
        if (itemElementRef.current) {
          setItemHeight(itemElementRef.current);
        }
      });
    }
  }, [windowWidth, setItemHeight]);

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
      {/* QUEST ORDER TOGGLE BUTTONS */}
      <div
        className={clsx(
          styles.questOrderToggleButtons,
          totalQuests <= 1 && styles.hidden,
        )}
      >
        {index > 0 && (
          <ChevronUpButton
            onClick={() => onQuestOrderChange(quest, "up")}
            aria-label="Move quest up"
            size={24}
          />
        )}
        {index < totalQuests - 1 && (
          <ChevronDownButton
            onClick={() => onQuestOrderChange(quest, "down")}
            aria-label="Move quest down"
            size={24}
          />
        )}
      </div>

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
            <span className={styles.smallScreenOnly}>EXP: </span>
            {quest.experienceShare}
          </Paragraph>
          <div className={styles.experienceButtons}>
            <ChevronUpButton
              aria-label="Increase experience"
              size={20}
              onClick={() => onExperienceShareChange(quest, "up")}
              onMouseDown={startIncreasingPointsOnMouseHold}
              onMouseUp={stopIncreasingPointsOnMouseHold}
              onMouseLeave={stopIncreasingPointsOnMouseHold}
              onKeyDown={startIncreasingPointsOnKeyHold}
              onKeyUp={stopIncreasingPointsOnKeyHold}
              disabled={quest.experienceShare === MAX_EXPERIENCE_POINTS}
            />
            <ChevronDownButton
              aria-label="Decrease experience"
              size={20}
              onClick={() => onExperienceShareChange(quest, "down")}
              onMouseDown={startDecreasingPointsOnMouseHold}
              onMouseUp={stopDecreasingPointsOnMouseHold}
              onMouseLeave={stopDecreasingPointsOnMouseHold}
              onKeyDown={startDecreasingPointsOnKeyHold}
              onKeyUp={stopDecreasingPointsOnKeyHold}
              disabled={quest.experienceShare === MIN_EXPERIENCE_POINTS}
            />
          </div>
        </div>

        {/* DELETE BUTTON */}
        {/* small screens */}
        <ButtonWrapper
          className={clsx(styles.deleteQuestButton, styles.smallScreenOnly)}
          color="background"
          onClick={handleDeleteClick}
          disabled={isRemoving}
          aria-label={`Delete quest ${quest.name}`}
        >
          DELETE QUEST
        </ButtonWrapper>
        {/* larger screens */}
        <button
          type="button"
          onClick={handleDeleteClick}
          className={clsx(styles.deleteQuestButton, styles.largerScreenOnly)}
          aria-label={`Delete quest ${quest.name}`}
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
