import { useCallback, useEffect, useRef, useState } from "react";

interface UseButtonHoldOptions {
  onHold?: () => void;
  holdInterval?: number;
}

/**
 * Custom hook for handling mouse hold interactions with customizable delay and repeat intervals.
 * 
 * @param holdDelayMs - The delay in milliseconds before the hold action is triggered
 * @param options - Configuration options for the hook
 * @param options.onHold - Callback function to execute when the mouse is held down
 * @param options.holdInterval - The interval in milliseconds between repeated `onHold` calls (default: 100ms)
 * 
 * @returns An object containing:
 * @returns {boolean} isHolding - Whether the mouse is currently being held
 * @returns {() => void} handleMouseDown - Event handler for mouse down events
 * @returns {() => void} handleMouseUpOrLeave - Event handler for mouse up and mouse leave events
 * 
 * @example
 * ```tsx
 * const { isHolding, handleMouseDown, handleMouseUpOrLeave } = useMouseHold(500, {
 *   onHold: () => console.log('Holding!'),
 *   holdInterval: 200
 * });
 * 
 * return (
 *   <button
 *     onMouseDown={handleMouseDown}
 *     onMouseUp={handleMouseUpOrLeave}
 *     onMouseLeave={handleMouseUpOrLeave}
 *   >
 *     {isHolding ? 'Holding...' : 'Press and hold'}
 *   </button>
 * );
 * ```
 */
export default function useButtonHold(
  holdDelayMs: number,
  { onHold, holdInterval = 100 }: UseButtonHoldOptions = {}
) {
  const [isHoldingMouse, setIsHoldingMouse] = useState(false);
  const mouseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseDown = useCallback(() => {
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    mouseTimeoutRef.current = setTimeout(() => {
      setIsHoldingMouse(true);
      if (onHold) {
        onHold();
        mouseIntervalRef.current = setInterval(onHold, holdInterval);
      }
    }, holdDelayMs);
  }, [holdDelayMs, onHold, holdInterval]);

  const handleMouseUpOrLeave = useCallback(() => {
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    if (mouseIntervalRef.current) clearInterval(mouseIntervalRef.current);
    mouseTimeoutRef.current = null;
    mouseIntervalRef.current = null;
    setIsHoldingMouse(false);
  }, []);



  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
      if (mouseIntervalRef.current) clearInterval(mouseIntervalRef.current);
    };
  }, []);

  return {
    isHoldingMouse,
    handleMouseDown,
    handleMouseUpOrLeave,
  };
}
