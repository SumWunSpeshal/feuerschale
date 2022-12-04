import NextImage, { StaticImageData } from "next/image";

type TileProps = {
  title: string;
  src: StaticImageData;
  imgAlt: string;
};

export default function Tile(props: TileProps) {
  const { title, src, imgAlt } = props;

  return (
    <div className="relative grid aspect-square place-items-end overflow-hidden rounded-3xl">
      <NextImage
        src={src}
        alt={imgAlt}
        className="col-start-1 row-start-1 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-zinc-900 bg-opacity-80"></div>
      <div className="relative col-start-1 row-start-1 py-4 px-6 text-white">
        {title}
      </div>
    </div>
  );
}
