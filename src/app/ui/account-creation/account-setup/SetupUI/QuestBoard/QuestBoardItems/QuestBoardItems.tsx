import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { sortAffectedAttributes } from "@/app/ui/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/app/ui/utils/helpers/getAttributeDisplayString";
import { useState, useRef, useEffect } from "react";
import {
  ChevronUpButton,
  ChevronDownButton,
} from "@/app/ui/Buttons/ChevronButtons/ChevronButtons";
import clsx from "clsx";
import useSetElementHeight from "@/utils/hooks/useSetElementHeight";

const ITEM_HEIGHT_ADJUSTMENT_ALLOWANCE = 50; // Adjustment allowance to account potential untracked height changes (e.g., addition of order buttons)
const DELETE_ANIMATION_DURATION_MS = 500; // Match CSS transition duration

interface QuestItemProps {
  quest: Quest;
  index: number;
  totalQuests: number;
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
}

function QuestItem({
  quest,
  index,
  totalQuests,
  onDeleteQuest,
  onQuestOrderChange,
}: QuestItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Set CSS variable for item height for animation purposes on deletion
  const setItemHeight = useSetElementHeight(ITEM_HEIGHT_ADJUSTMENT_ALLOWANCE);

  return (
    <div
      className={clsx(styles.questItem, isRemoving && styles.removing)}
      ref={setItemHeight}
    >
      {/* QUEST ORDER TOGGLE BUTTONS */}
      <div className={clsx(styles.questOrderToggleButtons, totalQuests <= 1 && styles.hidden)}>
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
      <Heading as="h4" color="background">
        {quest.name}
      </Heading>
      {/* ATTRIBUTES */}
      <Paragraph size="20" color="background">
        {sortAffectedAttributes(quest.affectedAttributes)
          .map((attr) => getAttributeDisplayString(attr))
          .join(", ")}
      </Paragraph>
      {/* STREAK */}
      <Paragraph size="20" color="background">
        Streak: 0
      </Paragraph>
      {/* STRENGTH */}
      <Paragraph size="20" color="background">
        Strength: 0 — E
      </Paragraph>
      {/* EXPERIENCE */}
      <div className={styles.experienceGainedSection}>
        <Paragraph size="20" color="background">
          Experience Gained: {0}
        </Paragraph>
        <div>{/* Exp toggle buttons */}</div>
      </div>
      {/* DELETE BUTTON */}
      <ButtonWrapper
        className={styles.deleteQuestButton}
        color="background"
        onClick={handleDeleteClick}
        disabled={isRemoving}
      >
        DELETE QUEST
      </ButtonWrapper>
    </div>
  );
}

interface QuestBoardItemsProps {
  quests: Quest[];
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
}

export default function QuestBoardItems({
  quests,
  onDeleteQuest,
  onQuestOrderChange,
}: QuestBoardItemsProps) {
  return (
    <div>
      {quests.length === 0 && (
        <Paragraph size="30" color="background">
          Time to add some quests!
        </Paragraph>
      )}
      {quests.map((quest, i) => (
        <QuestItem
          key={quest.name}
          quest={quest}
          index={i}
          totalQuests={quests.length}
          onDeleteQuest={onDeleteQuest}
          onQuestOrderChange={onQuestOrderChange}
        />
      ))}
    </div>
  );
}
