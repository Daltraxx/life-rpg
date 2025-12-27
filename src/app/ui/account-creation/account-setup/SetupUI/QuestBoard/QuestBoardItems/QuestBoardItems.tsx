import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import QuestItem from "./QuestBoardItem/QuestBoardItem";
import styles from "./styles.module.css";
import { clsx } from "clsx";

interface QuestBoardItemsProps {
  className?: string;
  quests: Quest[];
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
  onExperiencePointValueChange: (
    quest: Quest,
    direction: "up" | "down"
  ) => void;
}

export default function QuestBoardItems({
  className,
  quests,
  onDeleteQuest,
  onQuestOrderChange,
  onExperiencePointValueChange,
}: QuestBoardItemsProps) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={clsx(styles.headerRow, styles.largerScreenOnly)}>
        <Paragraph size="24" color="background">
          Quest
        </Paragraph>
        <Paragraph size="24" color="background">
          Attributes
        </Paragraph>
        <Paragraph size="24" color="background">
          Streak
        </Paragraph>
        <Paragraph size="24" color="background">
          Strength
        </Paragraph>
        <Paragraph size="24" color="background">
          Experience
        </Paragraph>
      </div>
      {quests.length === 0 && (
        <Paragraph size="30" color="background" className={styles.noQuestsMessage}>
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
          onExperiencePointValueChange={onExperiencePointValueChange}
        />
      ))}
    </div>
  );
}
