import Bounded from "@/app/ui/JSXWrappers/Bounded";
import introCopy from "@/copy/account-creation/account-setup/intro";
import { Span } from "@/app/ui/JSXWrappers/TextWrappers";
import Heading from "@/app/ui/JSXWrappers/Heading";

const explainerSections = introCopy.explainers.map((explainer, index) => (
  <section key={index}>
    <Heading as="h3">{explainer.title}</Heading>
    <ul>
      {explainer.points.map((point, pointIndex) => (
        <li key={pointIndex}>
          {point.text}
          {point.nestedPoints && (
            <ul>
              {point.nestedPoints.map((nestedPoint, nestedPointIndex) => (
                <li key={nestedPointIndex}>{nestedPoint}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </section>
));

export default function Intro() {
  return (
    <Bounded>
      <section>
        {/* TODO: Replace USER with actual user name */}
        <Span size="48-responsive">Hello USER!</Span>
        <Heading as="h1" size="36-responsive">{introCopy.heading}</Heading>
      </section>

      <section>{explainerSections}</section>
    </Bounded>
  );
}
