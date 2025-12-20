import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { sortAffectedAttributes } from "@/app/ui/utils/helpers/sortAffectedAttributes";
import { getAttributeDisplayString } from "@/app/ui/utils/helpers/getAttributeDisplayString";
import {
  ChevronUpButton,
  ChevronDownButton,
} from "@/app/ui/Buttons/ChevronButtons/ChevronButtons";

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
      {quests.map((quest, i) => (
        <div key={quest.order}>
          {/* QUEST ORDER TOGGLE BUTTONS */}
          <div className={styles.questOrderToggleButtons}>
            {i > 0 && (
              <ChevronUpButton
                onClick={() => onQuestOrderChange(quest, "up")}
                aria-label="Move quest up"
              />
            )}
            {i < quests.length - 1 && (
              <ChevronDownButton
                onClick={() => onQuestOrderChange(quest, "down")}
                aria-label="Move quest down"
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
          {/* TODO: Make screen shrinkage after deleting quest smoother? */}
          <ButtonWrapper
            className={styles.deleteQuestButton}
            color="background"
            onClick={() => onDeleteQuest(quest)}
          >
            DELETE QUEST
          </ButtonWrapper>
        </div>
      ))}
    </div>
  );
}
