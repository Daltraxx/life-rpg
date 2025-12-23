import { useCallback } from "react";

export default function useSetCSSProperty(propertyName: string, value: string) {
  return useCallback((element: HTMLElement | null) => {
    if (element) {
      console.log(`Setting ${propertyName} to ${value}`);
      element.style.setProperty(propertyName, value);
    }
  }, [propertyName, value]);
}
