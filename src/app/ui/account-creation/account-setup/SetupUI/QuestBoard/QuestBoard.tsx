import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import styles from "./styles.module.css";
import gridVars from "./vars.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import QuestBoardItems from "./QuestBoardItems/QuestBoardItems";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

export interface QuestBoardProps {
  quests: Quest[];
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
  onExperiencePointValueChange: (
    quest: Quest,
    direction: "up" | "down"
  ) => void;
}

export default function QuestBoard({
  quests,
  onDeleteQuest,
  onQuestOrderChange,
  onExperiencePointValueChange,
}: QuestBoardProps) {
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.questBoard}>
        <Heading as="h3" color="background" size="30">
          Quests for today:
        </Heading>
        <div className={styles.questBoardContent}>
          {quests.length > 0 ? (
            <QuestBoardItems
              quests={quests}
              onDeleteQuest={onDeleteQuest}
              onQuestOrderChange={onQuestOrderChange}
              onExperiencePointValueChange={onExperiencePointValueChange}
              className={gridVars.gridVars}
            />
          ) : (
            <Paragraph
              size="30"
              color="background"
              className={styles.noQuestsMessage}
            >
              Time to add some quests!
            </Paragraph>
          )}
        </div>
      </div>
    </section>
  );
}
