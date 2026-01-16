import { useCallback } from "react";

/**
 * Hook that returns a callback function to set a CSS custom property (`--item-height`) on an HTML element.
 *
 * @param adjustmentAllowance - Optional pixel value to add to the calculated height (default: 0)
 * @returns A memoized callback function that accepts an HTML element and optional reset flag
 *
 * @example
 * ```typescript
 * const setHeight = useSetElementHeight(10);
 * setHeight(elementRef.current); // Sets --item-height to element's height + 10px
 * setHeight(elementRef.current, true); // Resets --item-height to fit-content
 * ```
 *
 * @remarks
 * The callback sets the `--item-height` CSS custom property which can be used in stylesheets.
 * When `reset` is true, the property is set to "fit-content" regardless of the element's height.
 * The callback is memoized and only changes when `adjustmentAllowance` changes.
 */
export default function useSetElementHeight(adjustmentAllowance: number = 0) {
  return useCallback(
    (element: HTMLElement | null, reset: boolean = false) => {
      if (element) {
        if (reset) {
          element.style.setProperty("--item-height", "fit-content");
          return;
        }
        const height = element.offsetHeight;
        element.style.setProperty(
          "--item-height",
          `${height + adjustmentAllowance}px`
        );
      }
    },
    [adjustmentAllowance]
  );
}
