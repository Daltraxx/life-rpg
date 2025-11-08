import { useState, useLayoutEffect } from "react";

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);
  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth);
    let frame = 0;
    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frame);
    };
  }, []);
  return windowWidth;
}
