"use client";

import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";

/**
 * Properties for the ProgressBar component.
 * @property {number} start - The minimum value in the progress range
 * @property {number} end - The maximum value in the progress range
 * @property {number} current - The current progress value between start and end
 */
type ProgressBarProps = {
  start: number;
  end: number;
  current: number;
};

/**
 * Displays a visual progress bar with bounds and current value indicator.
 *
 * @param props - The progress bar properties
 * @param props.start - The minimum value in the range
 * @param props.end - The maximum value in the range
 * @param props.current - The current progress value between start and end
 * @returns A progress bar element with left bound, progress indicator, current value label, and right bound
 */
export default function ProgressBar({
  start,
  end,
  current,
}: ProgressBarProps) {
  const progressWidth = ((current - start) / (end - start)) * 100;
  return (
    <div className={styles.container}>
      <div
        className={styles.progress}
        style={{ width: `${progressWidth}%` }}
      ></div>
      <Span className={styles.leftBound}>{start}</Span>
      {/* TODO: Account for cases where current is so close to start or end that it overlaps with the bounds */}
      <Span className={styles.value} style={{ left: `${progressWidth}%` }}>
        {current !== start ? current : ""}
      </Span>
      <Span className={styles.rightBound}>{end}</Span>
    </div>
  );
}
