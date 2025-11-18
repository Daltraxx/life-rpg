import { ComponentProps } from "react";
import { Paragraph } from "@/app/ui/TextWrappers";
import { FontSize } from "@/app/ui/utils/fontSizeToTWMap";

interface FieldErrorsDisplayProps extends ComponentProps<"div"> {
  errors: string[] | undefined;
  id: string;
  fontSize: FontSize;
}

/**
 * Displays a list of field validation errors.
 * 
 * @param props - The component props
 * @param props.errors - Array of error messages to display. If empty or undefined, component renders nothing.
 * @param props.id - Optional HTML id attribute for the error container
 * @param props.fontSize - Font size to apply to error messages
 * @param props.restProps - Additional props to spread onto the root div element
 * 
 * @returns A div containing error messages as paragraphs, or null if no errors exist.
 * The container includes `aria-live="polite"` for accessibility to announce errors to screen readers.
 * 
 * @example
 * ```tsx
 * <FieldErrorsDisplay 
 *   errors={['Password is required', 'Password must be at least 8 characters']}
 *   id="password-errors"
 *   fontSize="sm"
 * />
 * ```
 */
export default function FieldErrorsDisplay({
  errors,
  id,
  fontSize,
  ...restProps
}: FieldErrorsDisplayProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div {...restProps} id={id} aria-live="polite">
      {errors.map((error) => (
        <Paragraph key={error} size={fontSize}>
          - {error}
        </Paragraph>
      ))}
    </div>
  );
}
