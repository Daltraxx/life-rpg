import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";

export default function QuestBoard() {
  return (
    <section>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board
      </Heading>
      <section className={styles.questBoard}>
        <Heading as="h3" color="background" size="36">Quests for today:</Heading>
      </section>
    </section>
  );
}
