import { useEffect, useState, RefObject, useRef, useEffectEvent } from "react";
import useWindowWidth from "./useWindowWidth";
import useElementWidth from "./useElementWidth";
import getTruncatedString from "@/utils/helpers/getTruncatedString";

/**
 * A custom hook that truncates a string based on the available width of an element
 * and a specified maximum width ratio relative to the window width.
 *
 * @param stringVal - The string value to be displayed, which may be truncated.
 * @param elementRef - A reference to the HTML element whose width will be evaluated.
 * @param maxWidthRatio - The ratio of the maximum allowed width relative to the window width.
 * @param placeholderText - The text to display when the string is empty.
 * @param fontName - The font name used for measuring the string width.
 * @param smallFontSize - The font size used when window width is small (< 768px) (default is 16).
 * @param largeFontSize - The font size used when window width is large (>= 768px) (default is 16).
 *
 * @returns The string to be displayed, which may be truncated based on the available width.
 *
 * @example
 * const truncatedString = useTruncatedString("This is a long string", elementRef, 0.8, "Loading...", "Arial");
 */
export default function useTruncatedString(
  stringVal: string,
  elementRef: RefObject<HTMLElement | null>,
  maxWidthRatio: number,
  placeholderText: string,
  fontName: string,
  smallFontSize: number = 16,
  largeFontSize: number = 16,
): string {
  const windowWidth = useWindowWidth();
  const elementWidth = useElementWidth(elementRef);
  const [displayString, setDisplayString] = useState(
    stringVal || placeholderText,
  );
  const [stringTruncated, setStringTruncated] = useState(false);

  const prevStringVal = useRef<string>(stringVal);

  // If the string value has changed to a shorter length, reset truncation state and allow re-evaluation
  const onStringValChange = useEffectEvent((newStringVal: string) => {
    if (newStringVal.length < prevStringVal.current.length) {
      setStringTruncated(false);
    }
    prevStringVal.current = newStringVal;
  });
  useEffect(() => {
    onStringValChange(stringVal);
  }, [stringVal]);

  // Reset truncation state on window resize to re-evaluate
  const onWindowResize = useEffectEvent(() => {
    setStringTruncated(false);
  });
  useEffect(() => {
    // Debounce the resize event to avoid excessive re-renders
    const resizeHandler = setTimeout(() => {
      onWindowResize();
    }, 300);

    return () => {
      clearTimeout(resizeHandler);
    };
  }, [windowWidth]);

  const onEvaluateTruncation = useEffectEvent(() => {
    const maxElementWidth = windowWidth * maxWidthRatio;
    const currentString = stringVal || placeholderText;
    if (elementWidth > maxElementWidth) {
      setStringTruncated(true);
      const truncatedString = getTruncatedString(
        currentString,
        windowWidth,
        elementWidth,
        maxElementWidth,
        { fontName, smallFontSize, largeFontSize },
      );
      setDisplayString(truncatedString);
    } else {
      setDisplayString(currentString);
    }
  });
  useEffect(() => {
    // If already truncated (window resize and reducing string length will reset this), do nothing to prevent infinite loop
    // (truncation reduces element width below threshold, which would trigger re-truncation)
    if (stringTruncated) return;

    const stringChangeHandler = setTimeout(() => {
      onEvaluateTruncation();
    }, 0);

    return () => {
      clearTimeout(stringChangeHandler);
    };
  }, [
    stringVal,
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
