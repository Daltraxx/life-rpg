"use client";

import { measureText } from "./measure-text";

type TruncateOptions = {
  font: string;
  smallFontSize: number;
  largeFontSize: number;
  fontWeight?: number;
  fontStyle?: string;
  windowWidthBreakpointMD?: number;
};

/**
 * Truncates a string to fit within a specified maximum width by removing characters from the end
 * and appending an ellipsis ("...").
 *
 * @param string - The string to be truncated
 * @param windowWidth - The current window width in pixels, used to determine font size
 * @param stringWidth - The initial measured width of the string in pixels
 * @param maxStringWidth - The maximum allowed width for the string in pixels
 * @param options - Configuration object for text measurement
 * @param options.font - The name of the font to use for text measurement
 * @param options.smallFontSize - The font size in pixels to use for windows narrower than the breakpoint
 * @param options.largeFontSize - The font size in pixels to use for windows wider than the breakpoint
 * @param options.fontWeight - The font weight to use for text measurement (default: 400)
 * @param options.fontStyle - The font style to use for text measurement (default: "normal")
 * @param options.windowWidthBreakpointMD - The window width breakpoint in pixels (default: 768)
 *
 * @returns The truncated string with "..." appended, or the original string if it fits within the maximum width
 *
 * @remarks
 * - Creates a persistent, hidden canvas element in the document body for text measurement (reused across calls)
 * - Uses a canvas context to measure text width with the specified font
 * - Font size is determined by comparing windowWidth to windowWidthBreakpointMD
 * - Creates a canvas element if one doesn't already exist in the document
 * - Iteratively removes characters from the end until the string fits within maxStringWidth
 * - The measurement includes the ellipsis ("...") in the final width calculation
 */
export default function getTruncatedString(
  string: string,
  windowWidth: number,
  stringWidth: number,
  maxStringWidth: number,
  options: TruncateOptions,
) {
  if (stringWidth <= maxStringWidth) return string;

  const {
    font,
    smallFontSize,
    largeFontSize,
    fontWeight = 400,
    fontStyle = "normal",
    windowWidthBreakpointMD = 768,
  } = options;

  const fontSize = windowWidth >= windowWidthBreakpointMD ? largeFontSize : smallFontSize;

  // Could optimize with binary search, but expected string lengths are short enough for iterative approach
  let truncated = string;
  let measuredWidth = stringWidth;
  while (measuredWidth > maxStringWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    measuredWidth = measureText(truncated + "...", {
      font,
      fontSize,
      fontWeight,
      fontStyle,
    });
  }

  return truncated + "...";
}
