import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";

// Mapping of attribute strengths to their display strings.
export const strengthDisplayMap: Record<AttributeStrength, string> = {
  normal: "normal",
  plus: "+",
  plusPlus: "++",
};
