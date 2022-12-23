import clsx from "clsx";
import Image from "next/image";
import Logo from "public/img/logo.svg";

export type LoaderProps = {
  loadings?: boolean[];
};

export function Loader(props: LoaderProps) {
  const { loadings = [] } = props;

  return (
    <div
      className={clsx(
        "fixed right-0 bottom-0 translate-y-full animate-pulse p-4 transition-transform delay-200",
        loadings.some(Boolean) && "translate-y-0"
      )}
    >
      <Image src={Logo} alt="Feuerschale Lade-Animation"></Image>
    </div>
  );
}
