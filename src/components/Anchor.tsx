import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

type AnchorProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement>
> & {
  href: string;
};

export function Anchor(props: AnchorProps) {
  const { href, children } = props;

  return (
    <Link href={href} className="underline">
      {children}
    </Link>
  );
}
