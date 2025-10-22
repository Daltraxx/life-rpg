/**
 * Maps font sizes (in pixels) to corresponding Tailwind CSS utility classes.
 *
 * Most keys represent font sizes in pixels (e.g., "16" = 16px).
 * The special "manual" key maps to an empty string for custom font sizing.
 * This object is readonly and provides a consistent mapping between
 * numeric font sizes and Tailwind's text size utilities.
 *
 * @example
 * ```typescript
 * const className = fontSizeToTWMap["24"]; // Returns "text-2xl"
 * ```
 */

const fontSizeToTWMap = {
  "custom": "",
  "16": "text-base",
  "20": "text-xl",
  "24": "text-2xl",
  "30": "text-3xl",
  "36": "text-4xl",
  "48": "text-5xl",
  "60": "text-6xl",
  "72": "text-7xl",
  "96": "text-8xl",
} as const;

export type FontSize = keyof typeof fontSizeToTWMap;

export { fontSizeToTWMap };
