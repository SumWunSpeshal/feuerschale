import clsx from "clsx";
import Link from "next/link";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";
import { Url } from "url";

const baseButtonStyles =
  "inline-flex items-center cursor-pointer gap-3 rounded-lg border-2 border-black bg-yellow-300 py-3 px-4 shadow-brutal transition-all hover:shadow-brutal-lg outline-none focus:shadow-brutal-lg";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button(props: ButtonProps) {
  const { children, disabled, className, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      className={clsx(
        baseButtonStyles,
        className,
        disabled &&
          "!shadow-brutal-gray-400 !cursor-auto !border-gray-400 !bg-gray-100 !text-gray-400 hover:!shadow-brutal-gray-400"
      )}
    >
      {children}
    </button>
  );
}

type AnchorProps = Omit<
  PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>,
  "href"
> & {
  href: string | Url;
};

function AnchorButton(props: AnchorProps) {
  const { children, className, ...rest } = props;

  return (
    <Link {...rest} className={clsx(baseButtonStyles, className)}>
      {children}
    </Link>
  );
}

Button.Anchor = AnchorButton;
