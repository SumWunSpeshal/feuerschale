import NextImage, { StaticImageData } from "next/image";
import Link from "next/link";
import { FeuerschaleRoute } from "src/types/routes";

type TileProps = {
  title: string;
  src: StaticImageData;
  imgAlt: string;
  href?: FeuerschaleRoute;
};

export default function Tile(props: TileProps) {
  const { title, src, imgAlt, href } = props;

  return (
    <Link href={href || "/"}>
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        <NextImage
          src={src}
          alt={imgAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900 bg-opacity-80"></div>
        <div className="absolute bottom-0 right-0 py-4 px-6 text-white">
          {title}
        </div>
      </div>
    </Link>
  );
}
