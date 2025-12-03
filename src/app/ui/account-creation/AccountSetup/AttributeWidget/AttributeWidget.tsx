import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from "../../../JSXWrappers/TextWrappers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

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
          <li>
            <button>
              <FontAwesomeIcon icon={faSquareXmark} />
            </button>
            Discipline
          </li>
          <li>
            <button>
              <FontAwesomeIcon icon={faSquareXmark} />
            </button>
            Vitality
          </li>
          <li>
            <button>
              <FontAwesomeIcon icon={faSquareXmark} />
            </button>
            Intelligence
          </li>
          <li>
            <button>
              <FontAwesomeIcon icon={faSquareXmark} />
            </button>
            Fitness
          </li>
        </ul>
      </section>
    </section>
  );
}
