"use client";

import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";
import clsx from "clsx";

/**
 * Properties for the ProgressBar component.
 * @property {number} start - The minimum value in the progress range
 * @property {number} end - The maximum value in the progress range
 * @property {number} current - The current progress value between start and end
 */
type ProgressBarProps = {
  size: "small" | "large";
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
  size,
}: ProgressBarProps) {
  const progressWidth = ((current - start) / (end - start)) * 100;
  return (
    <div className={clsx(styles.container, size === "small" ? styles.smallContainer : styles.largeContainer)}>
      <div
        className={styles.progress}
        style={{ width: `${progressWidth}%` }}
      ></div>
      <Span
        className={clsx(
          styles.leftBound,
          clsx(size === "small" ? styles.smallVal : styles.largeVal),
        )}
        size="custom"
      >
        {start}
      </Span>
      {/* TODO: Account for cases where current is so close to start or end that it overlaps with the bounds */}
      <Span
        className={clsx(
          styles.value,
          clsx(size === "small" ? styles.smallVal : styles.largeVal),
        )}
        style={{ left: `${progressWidth}%` }}
        size="custom"
      >
        {current !== start ? current : ""}
      </Span>
      <Span
        className={clsx(
          styles.rightBound,
          clsx(size === "small" ? styles.smallVal : styles.largeVal),
        )}
        size="custom"
      >
        {end}
      </Span>
    </div>
  );
}
