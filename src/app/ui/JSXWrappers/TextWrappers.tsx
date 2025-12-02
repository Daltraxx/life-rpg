import React from "react";
import { ComponentProps } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/app/ui/utils/fontSizeToTWMap";

/**
 * Creates a React component that wraps a specified HTML text element (`p`, `span`, or `label`)
 * with custom styling and props.
 *
 * @template T - The HTML element type to wrap ("p", "span", or "label").
 * @param element - The HTML element tag to use for the wrapper.
 * @returns A React functional component that renders the specified element with font styling,
 *          size, and additional props.
 *
 * @remarks
 * The returned component accepts a `size` prop to control font size, a `className` prop for custom classes,
 * and any other valid props for the specified element type. The `children` prop is used to render content inside the element.
 *
 * @example
 * ```tsx
 * const Paragraph = createTextWrapper("p");
 * <Paragraph size="24" className="text-red-500">Hello World</Paragraph>
 * ```
 */
/**
 * Creates a React component that wraps a specified HTML text element (`p`, `span`, `label`, or `li`)
 * with custom styling and props.
 *
 * @template T - The HTML element type to wrap ("p", "span", "label", or "li").
 * @param element - The HTML element tag to use for the wrapper.
 */
function createTextWrapper<T extends "p" | "span" | "label" | "li">(
  element: T
) {
  const TextWrapper = function ({
    size = "20",
    children,
    className,
    ...restProps
  }: ComponentProps<T> & { size?: FontSize }) {
    return React.createElement(
      element,
      {
        className: clsx("font-main", fontSizeToTWMap[size], className),
        ...restProps,
      },
      children
    );
  };

  TextWrapper.displayName = `TextWrapper(${element})`;
  return TextWrapper;
}

/**
 * A paragraph text wrapper component.
 *
 * This component is created using the `createTextWrapper` factory function
 * and renders a standard HTML `<p>` element with additional styling or functionality
 * as defined by the wrapper implementation.
 *
 * @example
 * ```tsx
 * <Paragraph>This is a paragraph of text.</Paragraph>
 * ```
 */
export const Paragraph = createTextWrapper("p");

/**
 * A styled span element wrapper component.
 *
 * This component is created using the `createTextWrapper` utility function to provide
 * a reusable span element with consistent styling and behavior across the application.
 *
 * @example
 * ```tsx
 * <Span>This is some text</Span>
 * ```
 *
 * @see {@link createTextWrapper} for the wrapper factory function
 */
export const Span = createTextWrapper("span");

/**
 * A styled label element wrapper component.
 *
 * This component is created using the `createTextWrapper` utility function to provide
 * a reusable label element with consistent styling and behavior across the application.
 *
 * @example
 * ```tsx
 * <Label htmlFor="input-id">This is a label</Label>
 * ```
 *
 * @see {@link createTextWrapper} for the wrapper factory function
 */
export const Label = createTextWrapper("label");

/**
 * A styled list item element wrapper component.
 *
 * This component is created using the `createTextWrapper` utility function to provide
 * a reusable list item element with consistent styling and behavior across the application.
 *
 * @example
 * ```tsx
 * <ListItem>This is a list item</ListItem>
 * ```
 *
 * @see {@link createTextWrapper} for the wrapper factory function
 */
export const ListItem = createTextWrapper("li");
