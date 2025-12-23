"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./QuestsWidget/vars.module.css";
import clsx from "clsx";
import QuestBoard from "./QuestBoard/QuestBoard";
import useQuestSetup from "@/app/ui/utils/hooks/useQuestSetup";
import useAttributeSetup from "@/app/ui/utils/hooks/useAttributeSetup";
import { Attribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

const INITIAL_ATTRIBUTES: Attribute[] = [
  { name: "Discipline", order: 0 },
  { name: "Vitality", order: 1 },
  { name: "Intelligence", order: 2 },
  { name: "Fitness", order: 3 },
];

export default function SetupUI() {
  // Manage available attributes state
  const attributeManagement = useAttributeSetup(INITIAL_ATTRIBUTES);
  const {
    availableAttributes,
    nextAttributeOrderNumber,
    actions: attributeActions,
  } = attributeManagement;

  // Manage quests state
  const questManagement = useQuestSetup();
  const {
    quests,
    nextQuestOrderNumber,
    actions: questActions,
  } = questManagement;

  return (
    <Bounded innerClassName={styles.setupContainer}>
      <div className={styles.widgetContainer}>
        <AttributeWidget
          className={styles.attributeWidget}
          attributes={availableAttributes}
          nextAttributeOrderNumber={nextAttributeOrderNumber}
          addAttribute={attributeActions.addAttribute}
          deleteAttribute={attributeActions.deleteAttribute}
        />
        <QuestsWidget
          availableAttributes={availableAttributes}
          quests={quests}
          addQuest={questActions.addQuest}
          nextQuestOrderNumber={nextQuestOrderNumber}
          className={clsx(styles.questsWidget, cssVars.questsWidgetVars)}
        />
      </div>
      <QuestBoard
        quests={quests}
        onDeleteQuest={questActions.deleteQuest}
        onQuestOrderChange={questActions.questOrderChange}
        onExperiencePointValueChange={questActions.experiencePointValueChange}
      />
    </Bounded>
  );
}
