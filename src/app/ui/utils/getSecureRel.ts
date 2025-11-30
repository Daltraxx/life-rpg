
/**
 * Generates a secure `rel` attribute value for anchor elements.
 * 
 * When the target is "_blank", automatically adds "noopener" and "noreferrer"
 * to the rel attribute to prevent security vulnerabilities (tabnabbing attacks)
 * and improve performance.
 * 
 * @param target - The target attribute value (e.g., "_blank", "_self")
 * @param rel - The existing rel attribute value (e.g., "external", "nofollow")
 * @returns A secure rel attribute string with "noopener" and "noreferrer" added
 *          when target is "_blank", otherwise returns the original rel value
 * 
 * @example
 * ```typescript
 * getSecureRel("_blank", "external");
 * // Returns: "external noopener noreferrer"
 * 
 * getSecureRel("_blank", undefined);
 * // Returns: "noopener noreferrer"
 * 
 * getSecureRel("_self", "external");
 * // Returns: "external"
 * ```
 */
export default function getSecureRel(target: string | undefined, rel: string | undefined): string | undefined { 
  const secureRel =
    target === "_blank"
      ? (() => {
          const tokens = new Set(rel?.trim() ? rel.split(/\s+/) : []);
          tokens.add("noopener");
          tokens.add("noreferrer");
          return Array.from(tokens).join(" ");
        })()
      : rel;
  return secureRel;
}