import { useEffect, useState, RefObject } from "react";
import useWindowWidth from "./useWindowWidth";
import useElementWidth from "./useElementWidth";
import getTruncatedString from "@/app/ui/utils/getTruncatedString";


/**
 * A custom React hook that automatically truncates a string to fit within a maximum width ratio of the window.
 * 
 * @param stringValue - The string to be displayed and potentially truncated. If undefined, placeholderText is used.
 * @param stringTruncated - Boolean flag indicating whether the string is currently truncated.
 * @param setStringTruncated - Callback function to update the truncation state.
 * @param elementRef - React ref object pointing to the HTML element containing the string.
 * @param maxWidthRatio - The maximum width ratio (0-1) relative to the window width that the element can occupy.
 * @param placeholderText - Text to display when stringValue is undefined.
 * @param fontName - The font family name used for width calculations. Defaults to "Jersey 10".
 * @param smallFontSize - The smaller font size in pixels for width calculations. Defaults to 36.
 * @param largeFontSize - The larger font size in pixels for width calculations. Defaults to 48.
 * 
 * @returns The display string, either the original value, truncated value, or placeholder text.
 * 
 * @remarks
 * This hook monitors window resizing and element width changes to dynamically truncate strings.
 * It includes a 300ms debounce on window resize events to prevent excessive re-calculations.
 * The truncation state is automatically reset on window resize to allow re-evaluation.
 * 
 * @example
 * ```typescript
 * const [isTruncated, setIsTruncated] = useState(false);
 * const elementRef = useRef<HTMLDivElement>(null);
 * const displayName = useTruncatedString(
 *   userName,
 *   isTruncated,
 *   setIsTruncated,
 *   elementRef,
 *   0.8,
 *   "[new user]"
 * );
 * ```
 */
export default function useTruncatedString(
  stringValue: string | undefined,
  stringTruncated: boolean,
  setStringTruncated: (truncated: boolean) => void,
  elementRef: RefObject<HTMLElement | null>,
  maxWidthRatio: number,
  placeholderText: string,
  fontName: string = "Jersey 10",
  smallFontSize: number = 36,
  largeFontSize: number = 48
): string {
  const windowWidth = useWindowWidth();
  const elementWidth = useElementWidth(elementRef);
  const [displayString, setDisplayString] = useState(
    stringValue || placeholderText
  );

  useEffect(() => {
    // If already truncated and  window hasn't been resized,
    // and component using this hook hasn't reset truncation state for re-evaluation, do nothing
    // This prevents infinite loop of updates when truncation brings username width under threshold
    if (stringTruncated) return;

    const maxElementWidth = windowWidth * maxWidthRatio;
    const currentString = stringValue || placeholderText;

    if (elementWidth > maxElementWidth && stringValue) {
      setStringTruncated(true);
      const truncatedString = getTruncatedString(
        stringValue,
        windowWidth,
        elementWidth,
        maxElementWidth,
        fontName,
        smallFontSize,
        largeFontSize
      );
      setDisplayString(truncatedString);
    } else {
      setDisplayString(currentString);
    }
  }, [
    stringValue,
    elementWidth,
    windowWidth,
    stringTruncated,
    maxWidthRatio,
    placeholderText,
    fontName,
    smallFontSize,
    largeFontSize,
  ]);

  // Reset truncation state on window resize to re-evaluate
  useEffect(() => {
    const resizeHandler = setTimeout(() => {
      setStringTruncated(false);
    }, 300);

    return () => {
      clearTimeout(resizeHandler);
    };
  }, [windowWidth]);

  return displayString;
}
