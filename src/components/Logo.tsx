import NextImage from "next/image";
import Link from "next/link";
import LogoSvg from "public/img/logo.svg";

type LogoProps = {};

export function Logo(props: LogoProps) {
  const {} = props;

  return (
    <Link href="/">
      <NextImage src={LogoSvg} alt="Feuerschale Logo" priority />
    </Link>
  );
}
