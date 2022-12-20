import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

type AnchorProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement>
> & {
  href: string;
};

export function Anchor(props: AnchorProps) {
  const { href, onClick, children } = props;

  return (
    <Link href={href} onClick={onClick} className="underline">
      {children}
    </Link>
  );
}
