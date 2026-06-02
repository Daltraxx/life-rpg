import clsx from "clsx";
import Heading from "../../../JSXWrappers/Heading/Heading";
import { Paragraph } from "../../../JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";

type PurposeStatementProps = {
  purposeText: string | null;
  className?: string;
};

export default function PurposeStatement({ purposeText, className }: PurposeStatementProps) {
  const displayText = purposeText ?? "Add your purpose statement in your profile!";
  return (
    <section className={clsx(styles.container, className)}>
      <Heading as="h3" size="30" color="blue-700">
        Purpose
      </Heading>
      <Paragraph color="blue-700" size="24-responsive">
        {displayText}
      </Paragraph>
    </section>
  );
}
