import { useEffect, useState, RefObject } from "react";
import useWindowWidth from "./useWindowWidth";
import useElementWidth from "./useElementWidth";
import getTruncatedString from "@/app/ui/utils/getTruncatedString";

/**
 * A custom hook that truncates a string based on the available width of an element
 * and a specified maximum width ratio relative to the window width.
 *
 * @param stringStateValue - The string value to be displayed, which may be truncated. Must be a state value.
 * @param elementRef - A reference to the HTML element whose width will be evaluated.
 * @param maxWidthRatio - The ratio of the maximum allowed width relative to the window width.
 * @param placeholderText - The text to display when the string is empty.
 * @param fontName - The font name used for measuring the string width (default is "Jersey 10").
 * @param smallFontSize - The font size used when window width is small (< 768px) (default is 36).
 * @param largeFontSize - The font size used when window width is large (>= 768px) (default is 48).
 *
 * @returns The string to be displayed, which may be truncated based on the available width.
 *
 * @example
 * const truncatedString = useTruncatedString("This is a long string", elementRef, 0.8, "Loading...");
 */
export default function useTruncatedString(
  stringStateValue: string,
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
    stringStateValue || placeholderText
  );
  const [stringTruncated, setStringTruncated] = useState(false);

  const [prevStringStateValue, setPrevStringStateValue] =
    useState(stringStateValue);
  
  useEffect(() => {
    // If the string value has changed to a shorter length, reset truncation state
    if (stringStateValue.length < prevStringStateValue.length) {
      setStringTruncated(false);
    }
    setPrevStringStateValue(stringStateValue);
  }, [stringStateValue]);

  // Reset truncation state on window resize to re-evaluate
  useEffect(() => {
    const resizeHandler = setTimeout(() => {
      setStringTruncated(false);
    }, 300);

    return () => {
      clearTimeout(resizeHandler);
    };
  }, [windowWidth]);

  useEffect(() => {
    // If already truncated and window hasn't been resized,
    // and component using this hook hasn't reset truncation state for re-evaluation, do nothing
    // This prevents infinite loop of updates when truncation brings username width under threshold
    if (stringTruncated) return;

    const maxElementWidth = windowWidth * maxWidthRatio;
    const currentString = stringStateValue || placeholderText;

    if (elementWidth > maxElementWidth) {
      setStringTruncated(true);
      const truncatedString = getTruncatedString(
        stringStateValue,
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
    stringStateValue,
    elementWidth,
    windowWidth,
    stringTruncated,
    maxWidthRatio,
    placeholderText,
    fontName,
    smallFontSize,
    largeFontSize,
  ]);

  return displayString;
}
