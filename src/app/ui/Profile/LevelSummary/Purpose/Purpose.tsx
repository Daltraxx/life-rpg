import Heading from "../../../JSXWrappers/Heading/Heading";
import { Paragraph } from "../../../JSXWrappers/TextWrappers/TextWrappers";

export default function Purpose({ purposeText }: { purposeText: string }) {
  return (
    <section>
      <Heading as="h3" size="30" color="blue-700">
        Purpose
      </Heading>
      <Paragraph color="blue-700" size="24-responsive">
        {purposeText}
      </Paragraph>
    </section>
  );
}
