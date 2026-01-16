"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./QuestsWidget/vars.module.css";
import clsx from "clsx";
import QuestBoard from "./QuestBoard/QuestBoard";
import useQuestManager from "@/utils/hooks/useQuestManager";
import useAttributeManager from "@/utils/hooks/useAttributeManager";
import type { Attribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import createProfile from "@/utils/actions/createProfile";
import { useActionState } from "react";
import { createSimpleInitialFormActionState } from "@/utils/helpers/createInitialFormActionState";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import useAffectedAttributeManager from "@/utils/hooks/useAffectedAttributeManager";

const INITIAL_ATTRIBUTES: Attribute[] = [
  { name: "Discipline" },
  { name: "Vitality" },
  { name: "Intelligence" },
  { name: "Fitness" },
];
const INITIAL_PROFILE_CREATION_STATE = createSimpleInitialFormActionState();

const NO_ATTRIBUTES_AVAILABLE_TEXT = "N/A";

export default function SetupUI() {
  // Manage available attributes state
  const attributeManagement = useAttributeManager(INITIAL_ATTRIBUTES);
  const {
    availableAttributes,
    actions: attributeActions,
  } = attributeManagement;

  // Manage affected attribute selection state
  const affectedAttributeManager = useAffectedAttributeManager(
    availableAttributes,
    NO_ATTRIBUTES_AVAILABLE_TEXT
  );

  // Manage quests state
  const questManagement = useQuestManager();
  const {
    quests,
    pointsRemaining,
    actions: questActions,
  } = questManagement;

  // Handle form submission state
  const [errorState, formAction, isPending] = useActionState(
    createProfile,
    INITIAL_PROFILE_CREATION_STATE
  );

  const isSubmitDisabled =
    quests.length === 0 ||
    pointsRemaining > 0 ||
    availableAttributes.length === 0;

  return (
    <form action={formAction}>
      <Bounded innerClassName={styles.setupContainer}>
        <div className={styles.widgetContainer}>
          <AttributeWidget
            className={styles.attributeWidget}
            attributes={availableAttributes}
            addAttribute={attributeActions.addAttribute}
            deleteAttribute={attributeActions.deleteAttribute}
          />
          <QuestsWidget
            affectedAttributeManager={affectedAttributeManager}
            quests={quests}
            addQuest={questActions.addQuest}
            className={clsx(styles.questsWidget, cssVars.questsWidgetVars)}
          />
        </div>
        <QuestBoard
          quests={quests}
          pointsRemaining={pointsRemaining}
          onDeleteQuest={questActions.deleteQuest}
          onQuestOrderChange={questActions.questOrderChange}
          onExperiencePointValueChange={questActions.experiencePointValueChange}
        />
        {errorState?.message && (
          <Paragraph className={styles.errorMessage} role="alert" size="20">
            {errorState.message}
          </Paragraph>
        )}
        {/* Hidden inputs to include user data in form submission */}
        <input type="hidden" name="quests" value={JSON.stringify(quests)} />
        <input
          type="hidden"
          name="attributes"
          value={JSON.stringify(availableAttributes)}
        />
        {/* TODO: Add styling for pending submission */}
        <ButtonWrapper
          className={styles.submitButton}
          color="blue-700"
          type="submit"
          disabled={isPending || isSubmitDisabled}
        >
          {isPending ? "SUBMITTING..." : "CONFIRM QUEST BOARD"}
        </ButtonWrapper>
      </Bounded>
    </form>
  );
}
