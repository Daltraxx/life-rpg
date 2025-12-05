import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import { JSX } from "react";

export default function SetupUI(): JSX.Element {
  return (
    <Bounded>
      <AttributeWidget />
    </Bounded>
  );
}
