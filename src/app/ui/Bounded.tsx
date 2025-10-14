import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  outerClassName?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

/**
 * Bounded container component that centers content with max-width constraint.
 *
 * @param as - The element type to render (default: "section")
 * @param className - Additional CSS classes to apply to the outer element
 * @param children - Content to render inside the bounded container
 */
export default function Bounded({
  as: Comp = "section",
  outerClassName,
  innerClassName,
  children,
}: BoundedProps) {
  return (
    <Comp className={clsx("px-4 py-8", outerClassName)}>
      <div className={clsx("mx-auto w-full max-w-7xl", innerClassName)}>{children}</div>
    </Comp>
  );
}
