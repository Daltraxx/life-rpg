"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";
import styles from "./styles.module.css";
import cssVars from "./vars.module.css";
import clsx from "clsx";
import QuestBoard from "@/app/ui/QuestBoard/QuestBoardSetup";
import useQuestManager from "@/utils/hooks/useQuestManager";
import useAttributeManager from "@/utils/hooks/useAttributeManager";
import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import createProfile from "@/utils/actions/createProfile";
import { useActionState } from "react";
import { createSimpleInitialFormActionState } from "@/utils/helpers/createInitialFormActionState";
import {
  ListItem,
  Paragraph,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import useAffectedAttributeManager from "@/utils/hooks/useAffectedAttributeManager";
import { Quest } from "@/utils/types/Quest";
import { Attribute } from "@/utils/types/attribute";
import updateProfile from "@/utils/actions/update-profile";

export interface SetupUIProps {
  mode: "create" | "edit";
  initialQuests: Quest[];
  initialAttributes: Attribute[];
}

const INITIAL_PROFILE_CREATION_STATE = createSimpleInitialFormActionState();

const NO_ATTRIBUTES_AVAILABLE_TEXT = "N/A";

export default function SetupUI({
  mode,
  initialQuests,
  initialAttributes,
}: SetupUIProps) {
  // Manage available attributes state
  const attributeManager = useAttributeManager(initialAttributes);
  const { availableAttributes } = attributeManager;

  // Manage affected attribute selection state
  const affectedAttributeManager = useAffectedAttributeManager(
    availableAttributes,
    NO_ATTRIBUTES_AVAILABLE_TEXT,
  );

  // Manage quests state
  const questManager = useQuestManager(initialQuests, availableAttributes);
  const { quests, pointsRemaining, actions: questActions } = questManager;

  // Handle form submission state
  const action = mode === "create" ? createProfile : updateProfile;
  const [errorState, formAction, isPending] = useActionState(action, INITIAL_PROFILE_CREATION_STATE);

  const hasQuestsWithNoExperienceShare = quests.some(
    (quest) => quest.experienceShare <= 0,
  );

  const isSubmitDisabled =
    quests.length === 0 ||
    pointsRemaining > 0 ||
    availableAttributes.length === 0 ||
    hasQuestsWithNoExperienceShare;

  return (
    <form
      action={formAction}
      aria-describedby={errorState?.message ? "quest-board-errors" : undefined}
    >
      <Bounded innerClassName={styles.setupContainer}>
        {/* ATTRIBUTE AND QUEST WIDGETS */}
        <div className={clsx(styles.widgetContainer, cssVars.widgetVars)}>
          <AttributeWidget
            className={styles.attributeWidget}
            attributeManager={attributeManager}
          />
          <QuestsWidget
            affectedAttributeManager={affectedAttributeManager}
            questManager={questManager}
            className={clsx(styles.questsWidget, cssVars.questsWidgetVars)}
          />
        </div>

        {/* QUEST BOARD AND SUBMISSION */}
        <QuestBoard
          quests={quests}
          pointsRemaining={pointsRemaining}
          onDeleteQuest={questActions.deleteQuest}
          onQuestOrderChange={questActions.questOrderChange}
          onExperienceShareChange={questActions.experienceShareChange}
        />

        {/* ERROR MESSAGES */}
        {!errorState?.message &&
          hasQuestsWithNoExperienceShare &&
          pointsRemaining === 0 && (
            <div id="quest-board-errors">
              <Paragraph className={styles.errorMessage} role="alert" size="20">
                All quests must have an experience share greater than 0.
              </Paragraph>
            </div>
          )}

        {errorState?.message && (
          <div id="quest-board-errors">
            <Paragraph className={styles.errorMessage} role="alert" size="20">
              {errorState.message}
            </Paragraph>
            {(errorState.errors?.attributes?.length ||
              errorState.errors?.quests?.length) && (
              <ul className={styles.errorList}>
                {errorState.errors?.attributes &&
                  errorState.errors.attributes.map((err, idx) => (
                    <ListItem
                      key={`attr-err-${idx}`}
                      className={styles.errorItem}
                      size="16"
                    >
                      {err}
                    </ListItem>
                  ))}
                {errorState.errors?.quests &&
                  errorState.errors.quests.map((err, idx) => (
                    <ListItem
                      key={`quest-err-${idx}`}
                      className={styles.errorItem}
                      size="16"
                    >
                      {err}
                    </ListItem>
                  ))}
              </ul>
            )}
          </div>
        )}

        {/* Hidden inputs to include user data in form submission */}
        <input type="hidden" name="quests" value={JSON.stringify(quests)} />
        <input
          type="hidden"
          name="attributes"
          value={JSON.stringify(availableAttributes)}
        />
        <input
          type="hidden"
          name="deletedQuestIds"
          value={JSON.stringify(questManager.deletedQuestIds)}
        />
        <input
          type="hidden"
          name="deletedAttributeIds"
          value={JSON.stringify(attributeManager.deletedAttributeIds)}
        />
        <input
          type="hidden"
          name="deletedAffectedAttributeIds"
          value={JSON.stringify(
            affectedAttributeManager.deletedAffectedAttributeIds,
          )}
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
