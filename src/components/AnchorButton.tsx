import clsx from "clsx";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

export function AnchorButton(props: ButtonProps) {
  const { children, className, ...rest } = props;

  return (
    <a
      {...rest}
      className={clsx(
        "inline-flex cursor-pointer gap-3 rounded-lg border-2 border-black bg-yellow-300 py-3 px-4 shadow-brutal transition-all hover:shadow-brutal-lg",
        className
      )}
    >
      {children}
    </a>
  );
}
