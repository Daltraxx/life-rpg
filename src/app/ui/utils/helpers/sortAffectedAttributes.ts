import { AffectedAttribute } from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

export const sortAffectedAttributes = (affectedAttributes: AffectedAttribute[]) => {
  const sortedAttributes = affectedAttributes.toSorted((a, b) => {
    if (a.strength === b.strength) {
      return a.name.localeCompare(b.name);
    } else if (a.strength === "plusPlus") {
      return -1;
    } else if (a.strength === "plus" && b.strength === "normal") {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedAttributes;
};