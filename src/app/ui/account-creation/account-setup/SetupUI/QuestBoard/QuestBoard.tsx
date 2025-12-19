import { Quest } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";

export interface QuestBoardProps {
  quests: Quest[];
}

export default function QuestBoard({ quests }: QuestBoardProps) {
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <section className={styles.questBoard}>
        <Heading as="h3" color="background" size="36">Quests for today:</Heading>
        <div>
          
        </div>
      </section>
    </section>
  );
}
