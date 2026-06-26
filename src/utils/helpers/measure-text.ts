"use client";

/**
 * Configuration object for canvas text measurement.
 * @property {string} font - The font family to use for text measurement.
 * @property {number} fontSize - The font size in pixels to use for text measurement.
 * @property {string} [fontStyle] - Optional font style (e.g., "italic") for text measurement.
 * @property {number} [fontWeight] - Optional font weight (e.g., 400, 700) for text measurement.
 */
export interface CanvasConfig {
  font: string;
  fontSize: number;
  fontStyle?: string;
  fontWeight?: number;
}

/**
 * Measures the width of text using canvas 2D context.
 * Creates a hidden canvas element for measurement if one doesn't exist.
 *
 * @param text - The text to measure
 * @param canvasConfig - Configuration object containing font properties
 * @returns The width of the text in pixels
 */
export const measureText = (
  text: string,
  canvasConfig: CanvasConfig,
): number => {
  const {
    font,
    fontSize,
    fontStyle = "normal",
    fontWeight = 400,
  } = canvasConfig;

  let canvas: HTMLCanvasElement | null = document.querySelector(
    "canvas[data-text-measurement]",
  );
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("data-text-measurement", "true");
    canvas.style.display = "none";
    document.body?.appendChild(canvas);
  }

  const context = canvas.getContext("2d");
  // Safety check, should never happen unless browser doesn't support canvas
  if (!context) {
    // Rough approximation: assume average character is ~8px wide
    const avgCharWidth = fontSize * 0.5;
    return text.length * avgCharWidth;
  }

  context.font = `${fontStyle} ${fontWeight} ${fontSize}px "${font}"`;

  return context.measureText(text).width;
};
