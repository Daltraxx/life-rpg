import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { UserProgress } from "@/utils/types/UserProgress";
import ProgressBar from "../Banner/LevelProgress/ProgressBar/ProgressBar";
import styles from "./styles.module.css";

export default function AttributeSummary({
  userProgress,
}: {
  userProgress: UserProgress;
}) {
  const { attributes } = userProgress;
  return (
    <section className={styles.container}>
      <Heading as="h2" size="30" color="blue-700">
        Attributes
      </Heading>
      <ul className={styles.list}>
        {attributes.map((attr) => (
          <li key={attr.attributeId} className={styles.listItem}>
            <Span
              className={styles.attributeName}
              color="blue-700"
              size="20"
            >
              {attr.attributeName} - {attr.level}
            </Span>
            <ProgressBar
              size="small"
              start={attr.levelStart}
              end={attr.levelEnd}
              current={attr.experience}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
