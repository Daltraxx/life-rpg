import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import QuestItem from "./QuestBoardItem/QuestBoardItem";
import styles from "./styles.module.css";

interface QuestBoardItemsProps {
  quests: Quest[];
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
  onExperiencePointValueChange: (
    quest: Quest,
    direction: "up" | "down"
  ) => void;
}

export default function QuestBoardItems({
  quests,
  onDeleteQuest,
  onQuestOrderChange,
  onExperiencePointValueChange,
}: QuestBoardItemsProps) {
  return (
    <div className={styles.container}>
      {quests.length === 0 && (
        <Paragraph size="30" color="background">
          Time to add some quests!
        </Paragraph>
      )}
      <div className={styles.headers}>
        
      </div>
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
