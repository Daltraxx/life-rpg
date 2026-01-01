import { useCallback, useEffect, useRef, useState } from "react";

export default function useMouseHold(
  holdDelayMs: number
) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHolding(true);
    }, holdDelayMs);
  }, [holdDelayMs]);

  const handleMouseUpOrLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHolding(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isHolding,
    handleMouseDown,
    handleMouseUpOrLeave,
  };
}
