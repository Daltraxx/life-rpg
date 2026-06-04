import { DailyQuestManager } from "@/utils/hooks/useDailyQuestManager";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";
import clsx from "clsx";

export interface DailyExperienceDisplayProps {
  dailyQuestManager: DailyQuestManager;
}

export default function DailyExperienceDisplay({
  dailyQuestManager,
}: DailyExperienceDisplayProps) {
  const { totalPoints, totalBonusPoints } = dailyQuestManager;
  return (
    <section className={styles.container}>
      <Heading
        as="h3"
        size="30-responsive"
        color="background"
        className={styles.heading}
      >
        Total Experience Earned Today:
      </Heading>

      <div
        className={styles.pointsContainer}
        aria-label={`${totalPoints} experience points earned today out of 100 with ${totalBonusPoints} bonus points`}
      >
        <Span
          size="24"
          color="background"
          className={styles.points}
          aria-hidden="true"
        >
          {totalBonusPoints > 0
            ? `${totalPoints} + ${totalBonusPoints} = ${totalPoints + totalBonusPoints}`
            : `${totalPoints}`}
        </Span>
        <span
          className={clsx(styles.points, styles.fractionBar)}
          aria-hidden="true"
        ></span>
        <Span
          size="24"
          color="background"
          className={styles.points}
          aria-hidden="true"
        >
          100
        </Span>
      </div>

      <Span
        size="24"
        color="background"
        className={styles.expLabel}
        aria-hidden="true"
      >
        EXP!
      </Span>
    </section>
  );
}
