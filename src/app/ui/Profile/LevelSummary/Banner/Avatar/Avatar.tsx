import Image from "next/image";
import styles from "./styles.module.css";

export default function Avatar() {
  return <Image src="/dsAvatar200-200.webp" alt="avatar" width={200} height={200} className={styles.avatarImage}/>;
}