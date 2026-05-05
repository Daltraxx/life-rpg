import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/utils/types/accountSetup/SetupAttributesAndQuests";
import QuestItem from "@/app/ui/QuestBoard/QuestItems/QuestItem/QuestItem";
import styles from "./styles.module.css";
import { clsx } from "clsx";

interface QuestItemsProps {
  className?: string;
  quests: Quest[];
}

export default function QuestItems({ className, quests }: QuestItemsProps) {
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
        <QuestItem
          key={quest.name}
          quest={quest}
          index={i}
          totalQuests={quests.length}
          className={styles.questItem}
        />
      ))}
    </div>
  );
}
