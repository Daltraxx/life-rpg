import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import QuestBoardItems from "./QuestBoardItems/QuestItems";

export interface QuestBoardProps {
  quests: Quest[];
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
}

export default function QuestBoard({
  quests,
  onDeleteQuest,
  onQuestOrderChange,
}: QuestBoardProps) {
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.questBoard}>
        <Heading as="h3" color="background" size="36">
          Quests for today:
        </Heading>
        <QuestBoardItems
          quests={quests}
          onDeleteQuest={onDeleteQuest}
          onQuestOrderChange={onQuestOrderChange}
        />
      </div>
    </section>
  );
}
