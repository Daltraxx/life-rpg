import { useCallback } from "react";

/**
 * Hook that returns a callback to set a CSS property on an HTML element.
 * @param propertyName - The name of the CSS property to set (e.g., '--my-color', 'background-color')
 * @param value - The value to assign to the CSS property
 * @returns A memoized callback function that accepts an HTMLElement and sets the specified CSS property to the given value
 * @example
 * ```typescript
 * const setMyColor = useSetCSSProperty('--my-color', '#ff0000');
 * useEffect(() => {
 *   setMyColor(elementRef.current);
 * }, [setMyColor]);
 * ```
 */
export default function useSetCSSProperty(propertyName: string, value: string) {
  return useCallback((element: HTMLElement | null) => {
    if (element) {
      element.style.setProperty(propertyName, value);
    }
  }, [propertyName, value]);
}
