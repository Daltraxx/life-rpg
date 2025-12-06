import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "./AttributeWidget/AttributeWidget";
import QuestsWidget from "./QuestsWidget/QuestsWidget";

export default function SetupUI() {
  return (
    <Bounded>
      <AttributeWidget />
      <QuestsWidget />
    </Bounded>
  );
}
