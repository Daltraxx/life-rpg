import { useCallback, useEffect, useRef, useState } from "react";

export default function useMouseHold(holdDelayMs: number, onHold: () => void) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = useCallback(() => {
    console.log("Mouse down - starting hold timer");
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

  // Trigger onHold callback when isHolding changes to true
  useEffect(() => {
    if (isHolding) {
      console.log("Held down - executing onHold callback");
      onHold();
    }
    if (!isHolding) {
      console.log("Releasing hold");
    }
  }, [isHolding, onHold]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    handleMouseDown,
    handleMouseUpOrLeave,
  };
}
