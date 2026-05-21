import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import ProgressBar from "./ProgressBar/ProgressBar";
import styles from "./styles.module.css";

export default function LevelProgress() {
  return (
    <div>
      <Heading color="blue-700" size="48-responsive">
        Level _
      </Heading>
      <ProgressBar />
    </div>
  );
}
