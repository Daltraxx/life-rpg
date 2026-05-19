import { DailyQuestManager } from "@/utils/hooks/useDailyQuestManager";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";

export interface DailyExperienceDisplayProps {
  dailyQuestManager: DailyQuestManager;
}

export default function DailyExperienceDisplay({
  dailyQuestManager,
}: DailyExperienceDisplayProps) { 
  return (
    <section>
      <Heading as="h3" size="30" color="background">
        Total Experience Earned Today:
      </Heading>
      <div>
        <div><p>{dailyQuestManager.totalExperience} + </p></div>
        <div></div>
      </div>
    </section>
  );
}