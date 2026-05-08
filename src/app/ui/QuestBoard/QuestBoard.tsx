import { Quest } from "@/utils/types/Quest";
import styles from "./styles.module.css";
import gridVars from "./vars.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import QuestItems from "./QuestItems/QuestItems";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

export interface QuestBoardProps {
  quests: Quest[];
}

export default function QuestBoard({ quests }: QuestBoardProps) {
  return (
    <section className={styles.container}>
      <Heading as="h2" color="blue-700" size="36">
        Current Quest Board:
      </Heading>
      <div className={styles.questBoard}>
        {quests.length > 0 ? (
          <>
            <QuestItems quests={quests} className={gridVars.gridVars} />
          </>
        ) : (
          <Paragraph
            size="30"
            color="background"
            className={styles.noQuestsMessage}
          >
            Complete the setup process so we can start completing quests!
          </Paragraph>
        )}
      </div>
    </section>
  );
}
