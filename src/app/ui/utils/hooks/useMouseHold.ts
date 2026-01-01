import { useCallback, useEffect, useRef, useState } from "react";

export default function useMouseHold(holdDelayMs: number, onHold?: () => void) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseDown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      if (onHold) {
        onHold();
        intervalRef.current = setInterval(onHold, 100);
      }
    }, holdDelayMs);
  }, [holdDelayMs, onHold]);

  const handleMouseUpOrLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
    setIsHolding(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isHolding,
    handleMouseDown,
    handleMouseUpOrLeave,
  };
}
