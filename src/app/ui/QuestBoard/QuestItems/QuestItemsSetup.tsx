import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/utils/types/Quest";
import QuestItemSetup from "@/app/ui/QuestBoard/QuestItems/QuestItem/QuestItemSetup";
import styles from "./styles.module.css";
import { clsx } from "clsx";

interface QuestItemsSetupProps {
  className?: string;
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
 * Renders a list of quest items for setup with a header row and individual quest items.
 * @param className - Optional CSS class name to apply to the container
 * @param quests - Array of setup quests to display
 * @param onDeleteQuest - Callback function invoked when a quest is deleted
 * @param onQuestOrderChange - Callback function invoked when quest order changes (up or down)
 * @param onExperienceShareChange - Callback function invoked when experience share changes (up or down)
 * @returns The rendered quest items setup component
 */
export default function QuestItemsSetup({
  className,
  quests,
  pointsRemaining,
  onDeleteQuest,
  onQuestOrderChange,
  onExperienceShareChange,
}: QuestItemsSetupProps) {
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
        <QuestItemSetup
          key={quest.name}
          quest={quest}
          index={i}
          totalQuests={quests.length}
          onDeleteQuest={onDeleteQuest}
          onQuestOrderChange={onQuestOrderChange}
          onExperienceShareChange={onExperienceShareChange}
          pointsRemaining={pointsRemaining}
          className={styles.questItem}
        />
      ))}
    </div>
  );
}
