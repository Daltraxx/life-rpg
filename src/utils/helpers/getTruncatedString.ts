"use client";

import { measureText } from "./measure-text";

/**
 * Configuration options for truncating a string based on its rendered width.
 * @typedef {Object} TruncateOptions
 * @property {string} font - The font name used for measuring the string width.
 * @property {number} fontSize - The font size used for measuring the string width.
 * @property {number} [breakpointFontSize] - The font size used when window width is large (>= 768px). Defaults to `fontSize` if not provided.
 * @property {number} [fontWeight] - The font weight used for measuring the string width. Defaults to 400.
 * @property {string} [fontStyle] - The font style used for measuring the string width. Defaults to "normal".
 * @property {number} [windowWidthBreakpointMD] - The window width breakpoint for determining which font size to use. Defaults to 768.
 * @property {number} [windowWidth] - The current window width. If not provided, fontSize only will be used for measurement.
 */
type TruncateOptions = {
  font: string;
  fontSize: number;
  breakpointFontSize?: number;
  fontWeight?: number;
  fontStyle?: string;
  windowWidthBreakpointMD?: number;
  windowWidth?: number;
};

/**
 * Truncates a string to fit within a maximum width, appending "..." if truncated.
 * @param string - The string to truncate.
 * @param stringWidth - The current rendered width of the string in pixels.
 * @param maxStringWidth - The maximum allowed width in pixels.
 * @param options - Configuration options for truncation.
 * @returns The truncated string with "..." appended if truncation occurred, otherwise the original string.
 */
export default function getTruncatedString(
  string: string,
  stringWidth: number,
  maxStringWidth: number,
  options: TruncateOptions,
) {
  if (stringWidth <= maxStringWidth) return string;

  const {
    font,
    fontSize,
    breakpointFontSize = fontSize,
    fontWeight = 400,
    fontStyle = "normal",
    windowWidth = 0,
    windowWidthBreakpointMD = 768,
  } = options;

  const currFontSize =
    windowWidth >= windowWidthBreakpointMD ? breakpointFontSize : fontSize;

  // Could optimize with binary search, but expected string lengths are short enough for iterative approach
  let truncated = string;
  let measuredWidth = stringWidth;
  while (measuredWidth > maxStringWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    measuredWidth = measureText(truncated + "...", {
      font,
      fontSize: currFontSize,
      fontWeight,
      fontStyle,
    });
  }

  return truncated + "...";
}
