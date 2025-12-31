import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import QuestBoardItem from "./QuestBoardItem/QuestBoardItem";
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
        <div className={styles.headerGrid}>
          <Paragraph size="30" color="background">
            Quest
          </Paragraph>
          <Paragraph size="30" color="background">
            Attributes
          </Paragraph>
          <Paragraph size="30" color="background">
            Streak
          </Paragraph>
          <Paragraph size="30" color="background">
            Strength
          </Paragraph>
          <Paragraph size="30" color="background">
            Experience
          </Paragraph>
        </div>
      </div>

      {quests.map((quest, i) => (
        <QuestBoardItem
          key={quest.name}
          quest={quest}
          index={i}
          totalQuests={quests.length}
          onDeleteQuest={onDeleteQuest}
          onQuestOrderChange={onQuestOrderChange}
          onExperiencePointValueChange={onExperiencePointValueChange}
          className={styles.questItem}
        />
      ))}
    </div>
  );
}
