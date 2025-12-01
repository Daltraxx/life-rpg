import Bounded from "@/app/ui/JSXWrappers/Bounded";
import introCopy from "@/copy/account-creation/account-setup/intro";
import { ListItem, Span } from "@/app/ui/JSXWrappers/TextWrappers";
import Heading from "@/app/ui/JSXWrappers/Heading";

const explainerSections = introCopy.explainers.map((explainer, index) => (
  <section key={index}>
    <Heading as="h3">{explainer.title}</Heading>
    <ul>
      {explainer.points.map((point, pointIndex) => (
        <ListItem key={pointIndex}>
          {point.text}
          {point.nestedPoints && (
            <ul>
              {point.nestedPoints.map((nestedPoint, nestedPointIndex) => (
                <ListItem key={nestedPointIndex}>{nestedPoint}</ListItem>
              ))}
            </ul>
          )}
        </ListItem>
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
