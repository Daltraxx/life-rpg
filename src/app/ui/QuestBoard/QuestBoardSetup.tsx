import { Quest } from "@/utils/types/accountSetup/AttributesAndQuests";
import styles from "./styles.module.css";
import gridVars from "./vars.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import QuestBoardItems from "./QuestItems/QuestItemsSetup";
import {
  Paragraph,
  Span,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

export interface QuestBoardSetupProps {
  quests: Quest[];
  pointsRemaining: number;
  onDeleteQuest: (quest: Quest) => void;
  onQuestOrderChange: (quest: Quest, direction: "up" | "down") => void;
  onExperiencePointValueChange: (
    quest: Quest,
    direction: "up" | "down",
  ) => void;
}

export default function QuestBoardSetup({
  quests,
  pointsRemaining,
  onDeleteQuest,
  onQuestOrderChange,
  onExperiencePointValueChange,
}: QuestBoardSetupProps) {
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.questBoard}>
        {quests.length > 0 ? (
          <>
            <QuestBoardItems
              quests={quests}
              onDeleteQuest={onDeleteQuest}
              onQuestOrderChange={onQuestOrderChange}
              onExperiencePointValueChange={onExperiencePointValueChange}
              className={gridVars.gridVars}
            />
            <Span
              className={styles.pointsRemaining}
              color="background"
              size="30-responsive"
            >
              Experience Points Remaining:{" "}
              {/* TODO: consider adding visual feedback when pointsRemaining reaches zero */}
              <span className={styles.pointsRemainingValue}>
                {pointsRemaining}
              </span>
            </Span>
          </>
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
    </section>
  );
}
