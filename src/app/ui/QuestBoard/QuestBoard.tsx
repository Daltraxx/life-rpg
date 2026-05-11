"use client";
import { DailyQuest } from "@/utils/types/DailyQuest";
import styles from "./styles.module.css";
import gridVars from "./vars.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import QuestItems from "./QuestItems/QuestItems";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import useDailyQuestManager from "@/utils/hooks/useDailyQuestManager";

export interface QuestBoardProps {
  /** Array of quests to display on the board */
  quests: DailyQuest[];
}

/**
 * QuestBoard component displays a list of the daily quests to complete.
 * Shows quest items in a grid layout if quests are available,
 * otherwise displays a message prompting the user to complete setup.
 *
 * @param props - Component props
 * @param props.quests - Array of quest objects to display
 * @returns The rendered quest board section
 */
export default function QuestBoard({ quests }: QuestBoardProps) {
  const dailyQuestManager = useDailyQuestManager(quests);
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.questBoard}>
        {quests.length > 0 ? (
          <QuestItems quests={quests} className={gridVars.gridVars} />
        ) : (
          <Paragraph
            size="30"
            color="background"
            className={styles.noQuestsMessage}
          >
            Complete the setup process so we can start completing quests!
          </Paragraph>
        )}
      </div>
    </section>
  );
}
