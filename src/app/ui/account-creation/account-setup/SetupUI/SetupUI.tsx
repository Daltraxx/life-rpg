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
import type { Attribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import type { User } from "@supabase/supabase-js";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import createProfile from "@/utils/actions/createProfile";
import { useActionState } from "react";
import { createSimpleInitialFormActionState } from "@/utils/helpers/createInitialFormActionState";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

const INITIAL_ATTRIBUTES: Attribute[] = [
  { name: "Discipline", order: 0 },
  { name: "Vitality", order: 1 },
  { name: "Intelligence", order: 2 },
  { name: "Fitness", order: 3 },
];
const INITIAL_PROFILE_CREATION_STATE = createSimpleInitialFormActionState();

export default function SetupUI({ authUser }: { authUser: User }) {
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
    pointsRemaining,
    actions: questActions,
  } = questManagement;

  // Handle form submission state
  const [errorState, formAction, isPending] = useActionState(
    createProfile,
    INITIAL_PROFILE_CREATION_STATE
  );

  const determineDisabledState = (): boolean => {
    if (quests.length === 0) return true;
    if (pointsRemaining > 0) return true;
    if (availableAttributes.length === 0) return true;
    return false;
  };

  return (
    <form action={formAction}>
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
        <input type="hidden" name="attributes" value={JSON.stringify(availableAttributes)} />
        <ButtonWrapper
          className={styles.submitButton}
          color="blue-700"
          type="submit"
          disabled={isPending || determineDisabledState()}
        >
          CONFIRM QUEST BOARD
        </ButtonWrapper>
      </Bounded>
    </form>
  );
}
