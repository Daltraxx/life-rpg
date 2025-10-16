import Link from "next/link";
import styles from ',./styles.module.css';

export default function Login() {
  return (
    <form action="">
      <label htmlFor="email-field">Email:</label>
      <input type="email" id="email-field" name="email" required />
      <label htmlFor="password-field">Password:</label>
      <input type="password" id="password-field" name="password" required />
      <button type="submit">Login</button>
      <Link href="/forgot-password">Forgot Password?</Link>
    </form>
  );
}