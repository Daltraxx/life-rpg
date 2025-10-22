import Bounded from "../../Bounded";
import Heading from "../../Heading";

export default function Header() {
  return (
    <Bounded as="header">
      <Heading as="h2" size="72">
        LifeRPG
      </Heading>
    </Bounded>
  );
}
