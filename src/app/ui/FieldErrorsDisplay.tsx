import { ComponentProps } from "react";
import { Paragraph } from "@/app/ui/TextWrappers";
import { FontSize } from "@/app/ui/utils/fontSizeToTWMap";

interface FieldErrorsDisplayProps extends ComponentProps<"div"> {
  errors: string[] | undefined;
  id: string;
  fontSize: FontSize;
}

export default function FieldErrorsDisplay({
  errors,
  id,
  fontSize,
  ...restProps
}: FieldErrorsDisplayProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div id={id} aria-live="polite" {...restProps}>
      {errors.map((error) => (
        <Paragraph key={error} size={fontSize}>
          - {error}
        </Paragraph>
      ))}
    </div>
  );
}
