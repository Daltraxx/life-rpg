import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";

export default function CreateAccountForm() {
  return (
    <Bounded>
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
