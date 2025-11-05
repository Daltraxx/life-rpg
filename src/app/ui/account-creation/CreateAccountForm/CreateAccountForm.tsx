import Bounded from "../../Bounded";
import { ButtonWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Heading from "../../Heading";
import Text from "../../Text";
import styles from "./styles.module.css";

export default function CreateAccountForm() {
  // TODO: Implement form state and validation
  // const [formData, setFormData] = useState({
  //   email: "",
  //   displayName: "",
  //   password: "",
  //   confirmPassword: "",
  // });
  // const [errors, setErrors] = useState<Record<string, string>>({});

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };
  return (
    <Bounded innerClassName={styles.contentContainer}>
      <div className={styles.headerContainer}>
        <Heading as="h1" size="48-responsive">
          Welcome [new user]!
        </Heading>
        <Text as="p" size="36-responsive" className={styles.subheading}>
          Please complete the following to set up your character profile...
        </Text>
      </div>

      <form className={styles.formContainer} action="">
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="displayName">Display Name:</label>
          <input id="displayName" type="text" name="displayName" required />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
          />
        </div>

        <ButtonWrapper
          type="submit"
          color="blue-600"
          className={styles.submitButton}
        >
          Create Account!
        </ButtonWrapper>
      </form>
    </Bounded>
  );
}
