import NextImage, { StaticImageData } from "next/image";
import Link from "next/link";
import { FeuerschaleRoute } from "src/types/routes";

type TileProps = {
  title: string;
  src: StaticImageData;
  imgAlt: string;
  href?: FeuerschaleRoute;
};

export function Tile(props: TileProps) {
  const { title, src, imgAlt, href } = props;

  return (
    <Link href={href || "/"}>
      <div className="group relative aspect-square overflow-hidden rounded-3xl border-2 border-black shadow-brutal transition-shadow hover:shadow-brutal-lg">
        <NextImage
          src={src}
          width={363}
          height={363}
          alt={imgAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-900/60"></div>
        <div className="absolute bottom-0 right-0 w-min py-6 px-8 text-right text-3xl tracking-wide text-white transition-all group-hover:font-bold">
          {title}
        </div>
      </div>
    </Link>
  );
}
