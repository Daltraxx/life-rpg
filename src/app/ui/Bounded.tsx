import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export default function Bounded({
  as: Comp = "section",
  className,
  children,
}: BoundedProps) {
  return (
    <Comp className={clsx("px-4 py-8", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </Comp>
  );
}
