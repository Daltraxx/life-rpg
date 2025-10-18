import styles from "./styles.module.css";
import Bounded from "../../Bounded";
import { ButtonWrapper, LinkWrapper, RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";

export default function Login() {
  return (
    <Bounded innerClassName={styles.loginContainer}>
      <form className={styles.loginForm} action="">
        <label htmlFor="email-field">Email:</label>
        <input type="email" id="email-field" name="email" required autoComplete="email" />
        <label htmlFor="password-field">Password:</label>
        <input
          type="password"
          id="password-field"
          name="password"
          required
          autoComplete="current-password"
        />
        <ButtonWrapper type="submit" className={styles.loginButton}>Login</ButtonWrapper>
        <RegularLinkWrapper href="/forgot-password">Forgot Password?</RegularLinkWrapper>
      </form>
      <div className={styles.divider}></div>
      <LinkWrapper href="/register">Create an account</LinkWrapper>
    </Bounded>
  );
}

// Instead of below, use formAction and isPending for changes in submit button

// Consider adding loading state to submit button.

// The submit button lacks a loading/disabled state during form submission, which can lead to:

// Multiple submission attempts
// Poor user feedback during authentication
// Add loading state handling:

// const [isLoading, setIsLoading] = useState(false);

// // In handleSubmit:
// setIsLoading(true);
// try {
//   // authentication logic
// } finally {
//   setIsLoading(false);
// }
// Then update the button:

// -<button type="submit">Login</button>
// +<button type="submit" disabled={isLoading}>
// +  {isLoading ? 'Logging in...' : 'Login'}
// +</button>
