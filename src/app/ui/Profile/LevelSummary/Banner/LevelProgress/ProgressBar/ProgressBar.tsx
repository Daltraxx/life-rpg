"use client";

import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css"

type ProgressBarProps = {
  start: number;
  end: number;
  currentValue: number;
};

export default function ProgressBar({ start, end, currentValue }: ProgressBarProps) {
  const progressWidth = ((currentValue - start) / (end - start)) * 100;
  return (
    <div className={styles.container}>
      <div className={styles.progress} style={{ width: `${progressWidth}%` }}>
      </div>
      <Span className={styles.leftBound}>{start}</Span>
      {/* TODO: Account for cases where currentValue is so close to start or end that it overlaps with the bounds */}
      <Span className={styles.value} style={{ left: `${progressWidth}%` }}>{currentValue !== start ? currentValue : ""}</Span>
      <Span className={styles.rightBound}>{end}</Span>
    </div>
  );
}