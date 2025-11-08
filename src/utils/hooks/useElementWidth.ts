import { useLayoutEffect, useState } from "react";


export default function useElementWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [elementWidth, setElementWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setElementWidth(ref.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [ref]);

  return elementWidth;
}
