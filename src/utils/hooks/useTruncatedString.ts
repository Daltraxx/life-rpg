import { useEffect, useState, RefObject, use } from "react";
import useWindowWidth from "./useWindowWidth";
import useElementWidth from "./useElementWidth";
import getTruncatedString from "@/app/ui/utils/getTruncatedString";



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

  const [prevStringStateValue, setPrevStringStateValue] = useState(stringStateValue);
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
    // If already truncated and  window hasn't been resized,
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
