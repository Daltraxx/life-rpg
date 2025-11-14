"use client";

/**
 * Truncates a string to fit within a specified maximum width by removing characters from the end
 * and appending an ellipsis ("...").
 *
 * @param string - The string to be truncated
 * @param windowWidth - The current window width in pixels, used to determine font size
 * @param stringWidth - The initial measured width of the string in pixels
 * @param maxStringWidth - The maximum allowed width for the string in pixels
 * @param fontName - The name of the font to use for text measurement
 * @param smallFontSize - The font size in pixels to use for windows narrower than the breakpoint
 * @param largeFontSize - The font size in pixels to use for windows wider than the breakpoint
 * @param windowWidthBreakpointMD - The window width breakpoint in pixels (default: 768)
 *
 * @returns The truncated string with "..." appended, or the original string if it fits within the maximum width
 *
 * @remarks
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
  fontName: string,
  smallFontSize: number,
  largeFontSize: number,
  windowWidthBreakpointMD: number = 768
) {
  if (stringWidth <= maxStringWidth) return string;

  let canvas: HTMLCanvasElement | null = document.querySelector(
    "canvas[data-text-measurement]"
  );
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("data-text-measurement", "true");
  }

  const context = canvas.getContext("2d");
  // Safety check, should never happen unless browser doesn't support canvas
  if (!context) return string;

  const fontSize =
    windowWidth >= windowWidthBreakpointMD ? largeFontSize : smallFontSize; // md breakpoint
  context!.font = `${fontSize}px "${fontName}"`;
  while (stringWidth > maxStringWidth && string.length > 0) {
    string = string.slice(0, -1);
    stringWidth = context!.measureText(string + "...").width; // NOTE: not a perfect measurement but close enough for now
  }
  return string + "...";
}
