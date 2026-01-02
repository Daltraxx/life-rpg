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
  // Mouse logic
  const [isHoldingButton, setIsHoldingButton] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseDown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHoldingButton(true);
      if (onHold) {
        onHold();
        intervalRef.current = setInterval(onHold, holdInterval);
      }
    }, holdDelayMs);
  }, [holdDelayMs, onHold, holdInterval]);

  const handleMouseUpOrLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
    setIsHoldingButton(false);
  }, []);

  // "Enter" and "Space" key logic
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMouseDown();
    }
  }, [handleMouseDown]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMouseUpOrLeave();
    }
  }, [handleMouseUpOrLeave]);


  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isHoldingButton,
    handleMouseDown,
    handleMouseUpOrLeave,
    handleKeyDown,
    handleKeyUp,
  };
}
