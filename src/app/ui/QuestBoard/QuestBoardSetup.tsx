import { Quest } from "@/utils/types/Quest";
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
  onExperienceShareChange: (
    quest: Quest,
    direction: "up" | "down",
  ) => void;
}

/**
 * Displays and manages the quest board during setup.
 * Shows a list of quests with controls for reordering and experience allocation,
 * or a message to add quests if the board is empty.
 *
 * @param props - The component props
 * @param props.quests - Array of quests to display
 * @param props.pointsRemaining - Remaining experience points available
 * @param props.onDeleteQuest - Handler for deleting a quest
 * @param props.onQuestOrderChange - Handler for reordering quests
 * @param props.onExperienceShareChange - Handler for adjusting experience allocation
 * @returns The rendered quest board setup component
 */
export default function QuestBoardSetup({
  quests,
  pointsRemaining,
  onDeleteQuest,
  onQuestOrderChange,
  onExperienceShareChange,
}: QuestBoardSetupProps) {
  return (
    <section className={styles.container} onClick={() => console.log(quests)}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.setupQuestBoard}>
        {quests.length > 0 ? (
          <>
            <QuestBoardItems
              quests={quests}
              onDeleteQuest={onDeleteQuest}
              onQuestOrderChange={onQuestOrderChange}
              onExperienceShareChange={onExperienceShareChange}
              pointsRemaining={pointsRemaining}
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
