import { useState, useEffect, useRef } from "react";

/**
 * React hook that provides the current window width (in pixels) and updates on resize.
 *
 * The hook sets the initial width on mount (if running in a browser) and subscribes to the
 * window "resize" event to keep the value up-to-date. By default updates are scheduled
 * via requestAnimationFrame to avoid layout thrashing; optionally, a debounce delay (in ms)
 * can be provided to batch rapid resize events using setTimeout.
 *
 * The hook is safe for server-side rendering: it returns 0 on the server and only reads
 * window.innerWidth when executed in a browser environment.
 *
 * Cleanup: the resize listener is removed on unmount, and any pending animation frame
 * or timeout is cancelled.
 *
 * @param debounceMs - Optional debounce delay in milliseconds. If > 0, resize updates are
 *                     debounced by this delay. If 0 (default), updates are scheduled with
 *                     requestAnimationFrame for smoother, non-blocking updates.
 * @returns The current window width in pixels. On the server (or before mount) this will be 0.
 *
 * @example
 * ```tsx
 * // Example usage inside a component
 * const width = useWindowWidth();
 * const isMobile = width < 768;
 * ```
 *
 * @remarks
 * - Uses a passive resize event listener for better scrolling performance where supported.
 * - Cancels any pending animation frame or timeout when the component unmounts.
 */
export default function useWindowWidth(debounceMs: number = 0): number {
  const [windowWidth, setWindowWidth] = useState(0);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      // Debounced resize handling
      if (debounceMs > 0) {
        if (timeoutRef.current !== null)
          window.clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(() => {
          setWindowWidth(window.innerWidth);
          timeoutRef.current = null;
        }, debounceMs);

        return;
      }
      // requestAnimationFrame-based resize handling
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [debounceMs]);
  return windowWidth;
}
