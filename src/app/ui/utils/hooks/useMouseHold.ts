import { useCallback, useEffect, useRef, useState } from "react";

interface UseMouseHoldOptions {
  onHold?: () => void;
  holdInterval?: number;
}

export default function useMouseHold(
  holdDelayMs: number,
  { onHold, holdInterval = 100 }: UseMouseHoldOptions = {}
) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseDown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHolding(true);
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
