import { DailyQuestManager } from "@/utils/hooks/useDailyQuestManager";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Span,  } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

export interface DailyExperienceDisplayProps {
  dailyQuestManager: DailyQuestManager;
}

export default function DailyExperienceDisplay({
  dailyQuestManager,
}: DailyExperienceDisplayProps) {
  const { totalPoints, totalBonusPoints } = dailyQuestManager;
  return (
    <section>
      <Heading as="h3" size="30" color="background">
        Total Experience Earned Today:
      </Heading>
      <div>
        <div>
          <Span size="24" color="background">
            {totalBonusPoints > 0
              ? `${totalPoints} + ${totalBonusPoints}`
              : `${totalPoints}`}
          </Span>
          <Span size="24" color="background">
            100
          </Span>
        </div>
      </div>
      <Span size="36" color="background">
        EXP!
      </Span>
    </section>
  );
}
