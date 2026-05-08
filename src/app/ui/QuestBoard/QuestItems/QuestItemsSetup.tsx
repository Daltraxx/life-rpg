import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { SetupQuest } from "@/utils/types/accountSetup/SetupAttributesAndQuests";
import QuestBoardItemSetup from "@/app/ui/QuestBoard/QuestItems/QuestItem/QuestItemSetup";
import styles from "./styles.module.css";
import { clsx } from "clsx";

interface QuestItemsSetupProps {
  className?: string;
  quests: SetupQuest[];
  onDeleteQuest: (quest: SetupQuest) => void;
  onQuestOrderChange: (quest: SetupQuest, direction: "up" | "down") => void;
  onExperienceShareChange: (
    quest: SetupQuest,
    direction: "up" | "down",
  ) => void;
}

export default function QuestItemsSetup({
  className,
  quests,
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
        <QuestBoardItemSetup
          key={quest.name}
          quest={quest}
          index={i}
          totalQuests={quests.length}
          onDeleteQuest={onDeleteQuest}
          onQuestOrderChange={onQuestOrderChange}
          onExperienceShareChange={onExperienceShareChange}
          className={styles.questItem}
        />
      ))}
    </div>
  );
}
