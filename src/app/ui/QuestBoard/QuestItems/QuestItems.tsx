import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { Quest } from "@/utils/types/Quest";
import QuestItem from "@/app/ui/QuestBoard/QuestItems/QuestItem/QuestItem";
import styles from "./styles.module.css";
import { clsx } from "clsx";

interface QuestItemsProps {
  className?: string;
  quests: Quest[];
}

/**
 * QuestItems component displays a list of quest items.
 *
 * @param props - Component props
 * @param props.className - Optional additional class name for styling
 * @param props.quests - Array of quest objects to display
 * @returns The rendered quest items section
 */
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
          className={styles.questItem}
        />
      ))}
    </div>
  );
}
