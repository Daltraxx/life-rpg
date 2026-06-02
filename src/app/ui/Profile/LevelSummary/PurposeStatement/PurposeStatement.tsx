import clsx from "clsx";
import Heading from "../../../JSXWrappers/Heading/Heading";
import { Paragraph } from "../../../JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";

type PurposeStatementProps = {
  purposeText: string;
  className?: string;
};

export default function PurposeStatement({ purposeText, className }: PurposeStatementProps) {
  return (
    <section className={clsx(styles.container, className)}>
      <Heading as="h3" size="30" color="blue-700">
        Purpose
      </Heading>
      <Paragraph color="blue-700" size="24-responsive">
        {purposeText}
      </Paragraph>
    </section>
  );
}
