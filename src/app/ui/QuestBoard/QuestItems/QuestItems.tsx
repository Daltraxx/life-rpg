import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import QuestItem from "@/app/ui/QuestBoard/QuestItems/QuestItem/QuestItem";
import styles from "./styles.module.css";
import { clsx } from "clsx";
import { DailyQuestManager } from '@/utils/hooks/useDailyQuestManager';

interface QuestItemsProps {
  className?: string;
  dailyQuestManager: DailyQuestManager;
}

/**
 * QuestItems component displays a list of quest items.
 *
 * @param props - Component props
 * @param props.className - Optional additional class name for styling
 * @param props.dailyQuestManager - The daily quest manager instance
 * @returns The rendered quest items section
 */
export default function QuestItems({ className, dailyQuestManager }: QuestItemsProps) {
  
  const { dailyQuests } = dailyQuestManager;
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

      {dailyQuests.map((quest) => (
        <QuestItem
          key={quest.id}
          quest={quest}
          className={styles.questItem}
          dailyQuestManager={dailyQuestManager}
        />
      ))}
    </div>
  );
}
