import { ButtonWrapper } from "@/app/ui/JSXWrappers/ButtonLikeWrappers/ButtonLikeWrappers";
import styles from "./styles.module.css";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import {
  Quest,
  AffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";
import { strengthDisplayMap } from "@/app/ui/utils/helpers/StrengthDisplayMap";

const getAttributeString = (attribute: AffectedAttribute) => {
  const { name, strength } = attribute;
  return `${name}${strength === "normal" ? "" : strengthDisplayMap[strength]}`;
};

interface QuestBoardItemsProps {
  quests: Quest[];
}

export default function QuestBoardItems({ quests }: QuestBoardItemsProps) {
  return (
    <div>
      {quests.map((quest) => (
        <div key={quest.order}>
          <Heading as="h4" color="background">
            {quest.name}
          </Heading>
          {/* ATTRIBUTES */}
          <Paragraph size="20" color="background">
            {quest.affectedAttributes
              .map((attr) => getAttributeString(attr))
              .join(", ")}
          </Paragraph>
          <Paragraph size="20" color="background">
            Streak: 0
          </Paragraph>
          <Paragraph size="20" color="background">
            Strength: 0 — E
          </Paragraph>
          <div className={styles.experienceGainedSection}>
            <Paragraph size="20" color="background">
              Experience Gained: {0}
            </Paragraph>
            <div>{/* Exp toggle buttons */}</div>
          </div>
          <ButtonWrapper
            className={styles.deleteQuestButton}
            color="background"
          >
            DELETE QUEST
          </ButtonWrapper>
        </div>
      ))}
    </div>
  );
}
