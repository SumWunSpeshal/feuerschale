import NextImage from "next/image";
import Link from "next/link";
import LogoSvg from "public/img/logo.svg";

type LogoProps = Record<string, never>;

export function Logo(props: LogoProps) {
  const {} = props;

  return (
    <Link href="/">
      <NextImage
        src={LogoSvg}
        alt="Feuerschale Logo"
        priority
        width={64}
        height={64}
      />
    </Link>
  );
}
