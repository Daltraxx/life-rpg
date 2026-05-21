"use client";

import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css"

export default function ProgressBar() {
  const left = 100;
  const right = 200;
  const value = 160;
  const progressWidth = ((value - left) / (right - left)) * 100;
  return (
    <div className={styles.container}>
      <div className={styles.progress} style={{ width: `${progressWidth}%` }}>
      </div>
      <Span className={styles.leftBound}>{left}</Span>
      <Span className={styles.value} style={{ left: `${progressWidth}%` }}>{value}</Span>
      <Span className={styles.rightBound}>{right}</Span>
    </div>
  );
}