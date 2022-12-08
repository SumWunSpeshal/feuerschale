import { ReactElement } from "react";

type PreviewListProps = {
  children?:
    | ReactElement<PreviewListItemProps>
    | Array<ReactElement<PreviewListItemProps>>;
};

export function PreviewList(props: PreviewListProps) {
  const { children } = props;

  return <ul className="divide-y-2 divide-black">{children}</ul>;
}

type PreviewListItemProps = {
  title?: string | JSX.Element | null;
  description?: string | JSX.Element;
};

const Item: React.FC<PreviewListItemProps> = (props) => {
  const { title, description } = props;

  return (
    <li className="py-2 first:pt-0 last:pb-0">
      <span className="text-lg leading-tight">{title}</span>
      {description && (
        <>
          <br />
          <span className="text-sm text-neutral-500">{description}</span>
        </>
      )}
    </li>
  );
};

PreviewList.Item = Item;
