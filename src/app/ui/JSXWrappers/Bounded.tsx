import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  outerClassName?: string;
  innerClassName?: string;
  verticalPadding?: boolean;
  children: React.ReactNode;
};

/**
 * Bounded container component that centers content with max-width constraint.
 *
 * @param as - The element type to render (default: "section")
 * @param className - Additional CSS classes to apply to the outer element
 * @param outerClassName - Additional CSS classes to apply to the outer element
 * @param innerClassName - Additional CSS classes to apply to the inner wrapper
 * @param verticalPadding - Whether to apply vertical padding (default: true)
 * @param children - Content to render inside the bounded container
 */
export default function Bounded({
  as: Comp = "section",
  outerClassName,
  innerClassName,
  verticalPadding = true,
  children,
}: BoundedProps) {
  return (
    <Comp className={clsx("px-4", verticalPadding && "py-4", outerClassName)}>
      <div className={clsx("mx-auto w-full max-w-7xl", innerClassName)}>
        {children}
      </div>
    </Comp>
  );
}
