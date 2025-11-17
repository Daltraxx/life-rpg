import { useLayoutEffect, useState } from "react";

/**
 * A custom React hook that tracks and returns the width of a DOM element.
 *
 * @param ref - A React ref object pointing to the HTML element whose width should be tracked
 * @param dependencies - Optional additional dependencies that will trigger a width recalculation when changed
 *
 * @returns The current width of the referenced element in pixels, or 0 if the element is not yet mounted
 *
 * @remarks
 * This hook uses `useLayoutEffect` to ensure the width is measured synchronously after DOM mutations.
 * It automatically sets up a ResizeObserver to update the width when the element is resized.
 * The observer is cleaned up when the component unmounts.
 * @example
 * ```tsx
 * const myRef = useRef<HTMLDivElement>(null);
 * const width = useElementWidth(myRef);
 *
 * return <div ref={myRef}>Width: {width}px</div>;
 * ```
 */
export default function useElementWidth(
  ref: React.RefObject<HTMLElement | null>,
  dependencies: React.DependencyList = []
): number {
  const [elementWidth, setElementWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      setElementWidth(element.offsetWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, ...dependencies]); // include dependencies if provided

  return elementWidth;
}
