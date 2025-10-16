/**
 * Maps font sizes (in pixels) to corresponding Tailwind CSS utility classes.
 *
 * The string keys represent font sizes in pixels (e.g., "16" = 16px).
 * This object is readonly and provides a consistent mapping between
 * numeric font sizes and Tailwind's text size utilities.
 *
 * @example
 * ```typescript
 * const className = fontSizeToTWMap["24"]; // Returns "text-2xl"
 * ```
 */
const fontSizeToTWMap = {
  "16": "text-base",
  "20": "text-xl",
  "24": "text-2xl",
  "36": "text-4xl",
  "48": "text-5xl",
  "72": "text-7xl",
  "96": "text-8xl",
} as const;

export { fontSizeToTWMap };
