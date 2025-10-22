import Bounded from "../../Bounded";
import Heading from "../../Heading";
import Text from "../../Text";
import styles from "./styles.module.css";

export default function Intro() { 
  return (
    <Bounded innerClassName={styles.introContainer}>
      <Heading as="h1" size="96" className={styles.mainHeading}>
        LifeRPG
      </Heading>
      <Text size="24" className={styles.introParagraph}>
        Grind your daily tasks, habits, and goals like one would their most
        addictive RPG. Gain experience, level up, and get that dopamine via
        on-screen progress that will be reflected in your real life mind,
        discipline, and capabilities. It&apos;s a feedback loop that can be
        mesmerizing in a video game. Now it can propel you to becoming
        overpowered in your own dreams, in your own life.
      </Text>
    </Bounded>
  );
}