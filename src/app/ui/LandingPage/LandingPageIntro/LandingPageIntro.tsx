import Bounded from "../../Bounded";
import Heading from "../../Heading";
import styles from "./styles.module.css";

export default function LandingPageIntro() { 
  return (
    <Bounded>
      <Heading as="h1" size="96" className={styles.mainHeading}>
        Life RPG
      </Heading>
    </Bounded>
  )
}