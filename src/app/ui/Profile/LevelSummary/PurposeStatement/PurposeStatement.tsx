import clsx from "clsx";
import Heading from "../../../JSXWrappers/Heading/Heading";
import { Paragraph } from "../../../JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";

type PurposeStatementProps = {
  purposeText: string | null;
  className?: string;
};

export default function PurposeStatement({ purposeText, className }: PurposeStatementProps) {
  // TODO: Make link to edit purpose statement once that functionality is implemented
  const displayText =
    purposeText ??
    "\"First say to yourself what you would be; and then do what you have to do.\" - Epictetus";
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
