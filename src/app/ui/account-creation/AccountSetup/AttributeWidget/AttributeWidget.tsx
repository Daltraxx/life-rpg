import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from '../../../JSXWrappers/TextWrappers';

export default function AttributeWidget() {
  return (
      <section>
        <Heading as="h3">Add Attributes</Heading>
        <Label htmlFor="add-attribute">Attribute Name</Label>
        <div>
          <input type="text" id="add-attribute" />
          <button type="button">ADD</button>
      </div>
      <section>
        <Heading as="h4">Current Attributes</Heading>
        <ul>
          <li>Discipline</li>
          <li>Vitality</li>
          <li>Intelligence</li>
          <li>Fitness</li>
        </ul>
      </section>
      </section>
  );
}
