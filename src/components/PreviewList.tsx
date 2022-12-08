import Link from "next/link";
import { ReactElement } from "react";

type PreviewListProps = {
  children?:
    | ReactElement<PreviewListItemProps>
    | ReactElement<PreviewListItemProps>[];
};

export function PreviewList(props: PreviewListProps) {
  const { children } = props;

  return <ul className="divide-y-2 divide-black">{children}</ul>;
}

type PreviewListItemProps = {
  title?: string | JSX.Element | null;
  description?: string | JSX.Element;
  href?: string;
};

const Item: React.FC<PreviewListItemProps> = (props) => {
  const { title, description, href } = props;

  return (
    <li className="py-2 first:pt-0 last:pb-0">
      {href ? (
        <Link href={href} className="group block">
          <ItemInner title={title} description={description} />
        </Link>
      ) : (
        <ItemInner title={title} description={description} />
      )}
    </li>
  );
};

const ItemInner: React.FC<Omit<PreviewListItemProps, "href">> = (props) => {
  const { title, description } = props;

  return (
    <>
      <span className="text-lg leading-tight transition-all duration-100 group-hover:font-bold">
        {title}
      </span>
      {description && (
        <>
          <br />
          <span className="text-sm text-neutral-500">{description}</span>
        </>
      )}
    </>
  );
};

PreviewList.Item = Item;
