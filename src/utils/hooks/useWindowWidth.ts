import { useState, useEffect } from "react";

/**
 * Returns the current browser window width in pixels and updates on resize.
 *
 * On mount, it reads `window.innerWidth` and subscribes to the `resize` event.
 * Resize updates are coalesced to the next animation frame via `requestAnimationFrame`
 * to reduce render frequency and avoid layout thrashing. The event listener and any
 * pending animation frame are cleaned up on unmount.
 *
 * Remarks:
 * - The initial value is `0` until the effect runs on the client.
 * - This hook relies on the `window` object and should be used in a browser environment.
 *
 * @returns The current window width in CSS pixels.
 *
 * @example
 * const width = useWindowWidth();
 * const isNarrow = width < 768;
 */
export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowWidth(window.innerWidth);
    let frame: number | null = null;
    const handleResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return windowWidth;
}
