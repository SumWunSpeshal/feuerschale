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

  return (
    <ul className={clsx("divide-y divide-black", className)}>{children}</ul>
  );
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
    <li className={clsx("py-2 first:pt-0 last:pb-0", className)}>
      {href ? (
        <Link
          href={href}
          className="group block rounded-md ring-amber-200 transition-all duration-75 hover:bg-amber-200 hover:ring-8"
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
