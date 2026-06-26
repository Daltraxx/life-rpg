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

  const prevStringVal = useRef<string>(stringVal);

  const truncationHandler = () => { 
    const maxElementWidth = windowWidth * maxWidthRatio;
    const currentString = stringVal || placeholderText;
    if (currentString === placeholderText) {
      setDisplayString(placeholderText);
      return;
    }
    if (elementWidth > maxElementWidth) {
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
  }

  const onStringValChange = useEffectEvent(() => {
    truncationHandler();
  });

  const onWindowWidthChange = useEffectEvent(() => {
    truncationHandler();
  });

  // Trigger truncation evaluation when the string value changes
  useEffect(() => {
    if (prevStringVal.current !== stringVal) {
      prevStringVal.current = stringVal;
      onStringValChange();
    }
  }, [stringVal]);

  // Trigger truncation evaluation when the window width changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onWindowWidthChange();
    }, 300); // Debounce the window resize event to avoid excessive calculations
    return () => clearTimeout(timeoutId);
  }, [windowWidth]);

  return displayString;
}
