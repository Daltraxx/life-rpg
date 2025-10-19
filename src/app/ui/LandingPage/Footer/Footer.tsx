import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Bounded from "../../Bounded";

export default function Footer() {
  return (
    <Bounded as="footer">
      <RegularLinkWrapper href="https://www.daltonpettus.com/" target="_blank" fontSize="36" color="orange-300">
        by daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
