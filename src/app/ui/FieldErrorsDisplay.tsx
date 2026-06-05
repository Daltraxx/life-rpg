import { ComponentProps } from "react";
import {
  Paragraph,
  type TextColor,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { FontSize } from "@/utils/helpers/fontSizeToTWMap";

interface FieldErrorsDisplayProps extends ComponentProps<"div"> {
  errors: string[] | undefined;
  id: string;
  fontSize: FontSize;
  color?: TextColor;
}

/**
 * Displays a list of field validation errors.
 *
 * @param props - The component props
 * @param props.errors - Array of error messages to display. If empty or undefined, component renders nothing.
 * @param props.id - Optional HTML id attribute for the error container,
 * useful for accessibility (referenced by aria-describedby on form fields).
 * @param props.fontSize - Font size to apply to error messages
 * @param props.color - Text color to apply to error messages, defaults to "red-500"
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
  color = "red-500",
  ...restProps
}: FieldErrorsDisplayProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div {...restProps} id={id} aria-live="polite">
      {errors.map((error) => (
        <Paragraph key={error} size={fontSize} color={color}>
          - {error}
        </Paragraph>
      ))}
    </div>
  );
}
