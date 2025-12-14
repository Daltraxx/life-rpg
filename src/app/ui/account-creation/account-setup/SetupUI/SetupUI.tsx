import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./QuestsWidget/vars.module.css";
import clsx from "clsx";

export default function SetupUI() {
  return (
    <Bounded>
      <div className={styles.uiContainer}>
        <AttributeWidget className={styles.attributeWidget} />
        <QuestsWidget className={clsx(styles.questsWidget, cssVars.questsWidgetVars)} />
      </div>
    </Bounded>
  );
}
