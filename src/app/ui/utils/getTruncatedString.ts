"use client";

/**
 * Truncates a string to fit within a specified maximum width by removing characters from the end
 * and appending an ellipsis ("...").
 * 
 * @param string - The string to be truncated
 * @param windowWidth - The current window width in pixels, used to determine font size
 * @param stringWidth - The initial measured width of the string in pixels
 * @param maxStringWidth - The maximum allowed width for the string in pixels
 * 
 * @returns The truncated string with "..." appended, or the original string with "..." if it fits within the maximum width
 * 
 * @remarks
 * - Uses a canvas context to measure text width with the "Jersey 10" font
 * - Font size is 48px for windows wider than 768px (md breakpoint), otherwise 36px
 * - Creates a canvas element if one doesn't already exist in the document
 * - Iteratively removes characters from the end until the string fits within maxStringWidth
 * - The measurement includes the ellipsis ("...") in the final width calculation
 */
export default function getTruncatedString(
  string: string,
  windowWidth: number,
  stringWidth: number,
  maxStringWidth: number
) {
  let canvas = document.querySelector("canvas");
  if (!canvas) canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const fontSize = windowWidth > 768 ? 48 : 36; // md breakpoint
  context!.font = `${fontSize}px "Jersey 10"`; // Ensure font matches heading font
  while (stringWidth > maxStringWidth && string.length > 0) {
    string = string.slice(0, -1);
    stringWidth = context!.measureText(string + "...").width; // NOTE: not a perfect measurement but close enough for now
  }
  return string + "...";
}
