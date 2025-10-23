import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import Text from "../../Text";

export default function CreateAccountForm() {
  return (
    <Bounded>
      <div>
        <Heading as="h1" size="48">
          Welcome [new user]!
        </Heading>
        <Text as="p" size="36">
          Please complete the following to set up your character profile...
        </Text>
      </div>

      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" name="password" required />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
        />

        <ButtonWrapper type="submit">Create Account</ButtonWrapper>
      </form>
    </Bounded>
  );
}
