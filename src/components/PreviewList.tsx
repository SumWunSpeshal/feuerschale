import clsx from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

type PreviewListProps = {
  children?:
    | ReactElement<PreviewListItemProps>
    | ReactElement<PreviewListItemProps>[];
  className?: string;
};

export function PreviewList(props: PreviewListProps) {
  const { children, className } = props;

  return <ul className={className}>{children}</ul>;
}

type PreviewListItemProps = {
  title?: string | JSX.Element | null;
  description?: string | JSX.Element;
  href?: string;
  className?: string;
};

const Item: React.FC<PreviewListItemProps> = (props) => {
  const { title, description, href, className } = props;

  return (
    <li
      className={clsx(
        "border-b border-gray-400 py-3 first:pt-0 last:border-0 last:pb-0",
        className
      )}
    >
      {href ? (
        <Link
          href={href}
          className="group block rounded-md ring-stone-100 transition-all duration-75 hover:bg-stone-100 hover:ring-8"
        >
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
      <div className="overflow-hidden overflow-ellipsis text-lg leading-tight transition-all duration-100 group-hover:font-bold">
        {title}
      </div>
      {description && (
        <div className="mt-1 text-sm text-neutral-500">{description}</div>
      )}
    </>
  );
};

PreviewList.Item = Item;
