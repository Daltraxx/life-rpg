import { useCallback } from "react";

/**
 * A custom React hook that sets a CSS custom property `--item-height` on an element
 * based on its calculated offsetHeight.
 *
 * This hook sets the `--item-height` CSS variable once when the element is attached.
 *
 * @returns A callback ref to attach to the target element.
 *
 * @example
 * ```tsx
 * const myRef = useRef<HTMLDivElement>(null);
 * useSetElementHeight(myRef);
 *
 * return <div ref={myRef}>Content here</div>;
 * ```
 *
 * @remarks
 * The CSS custom property can be accessed in stylesheets using `var(--item-height)`.
 * Note: The hook uses `offsetHeight` which includes padding and borders but not margins.
 */
export default function useSetElementHeight() {
  return useCallback((element: HTMLElement | null) => {
    if (element) {
      const height = element.offsetHeight;
      element.style.setProperty("--item-height", `${height}px`);
      console.log(`Set --item-height to ${height}px`);
    }
  }, []);
}
