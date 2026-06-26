"use client";

export interface CanvasConfig {
  font: string;
  fontSize: number;
  fontStyle?: string;
  fontWeight?: number;
}

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
