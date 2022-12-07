import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;

  return (
    <button
      {...rest}
      className="inline-flex cursor-pointer gap-3 rounded-lg border-2 border-black bg-yellow-300 py-3 px-4 shadow-brutal transition-all hover:shadow-brutal-lg"
    >
      {children}
    </button>
  );
}
