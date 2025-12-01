import Bounded from "@/app/ui/JSXWrappers/Bounded";
import introCopy from "@/copy/account-creation/account-setup/intro";
import { Span } from "@/app/ui/JSXWrappers/TextWrappers";

const explainerSections = introCopy.explainers.map((explainer, index) => (
  <section key={index}>
    <h3>{explainer.title}</h3>
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
        <Span>Hello USER!</Span>
        <h1>{introCopy.heading}</h1>
      </section>

      <section>{explainerSections}</section>
    </Bounded>
  );
}
