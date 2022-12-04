import NextImage, { StaticImageData } from "next/image";

type TileProps = {
  title: string;
  src: StaticImageData;
  imgAlt: string;
};

export default function Tile(props: TileProps) {
  const { title, src, imgAlt } = props;

  return (
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
  );
}
