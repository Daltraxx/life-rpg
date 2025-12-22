import { RefObject, useEffect } from "react";

/**
 * A custom React hook that sets a CSS custom property `--item-height` on an element
 * based on its calculated offsetHeight.
 *
 * This hook monitors the provided element reference and automatically updates the
 * `--item-height` CSS variable whenever the element's height changes.
 *
 * @param elementRef - A React ref object pointing to the HTML element whose height
 *                     should be measured and stored as a CSS custom property.
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
export default function useSetElementHeight(
  elementRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (elementRef.current) {
      const height = elementRef.current.offsetHeight;
      elementRef.current.style.setProperty("--item-height", `${height}px`);
    }
  }, [elementRef.current]);
}
