import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";

export default function SetupUI() {
  return (
    <Bounded innerClassName={styles.uiContainer}>
      <AttributeWidget className={styles.attributeWidget} />
      <QuestsWidget />
    </Bounded>
  );
}
