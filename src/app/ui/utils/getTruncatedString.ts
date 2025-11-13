"use client";

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
