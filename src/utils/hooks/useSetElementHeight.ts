import { useCallback } from "react";


/**
 * A custom hook that sets a CSS variable for the height of a given HTML element.
 *
 * @param adjustmentAllowance - An optional number that specifies an additional height 
 * to be added to the element's offset height in case of untracked changes. Defaults to 0.
 *
 * @returns A callback function that takes an HTMLElement or null as an argument. 
 * When called with an HTMLElement, it calculates the element's offset height, 
 * adds the adjustment allowance, and sets the CSS variable `--item-height` 
 * to the resulting value in pixels.
 *
 * @example
 * const setHeight = useSetElementHeight(10);
 * const ref = useRef<HTMLDivElement>(null);
 * useEffect(() => {
 *   setHeight(ref.current);
 * }, [ref]);
 */
export default function useSetElementHeight(adjustmentAllowance = 0) {
  return useCallback((element: HTMLElement | null) => {
    if (element) {
      const height = element.offsetHeight;
      element.style.setProperty("--item-height", `${height + adjustmentAllowance}px`);
  }, [adjustmentAllowance]);
  }, []);
}
