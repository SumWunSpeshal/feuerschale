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
  key: string | number;
  title?: string | JSX.Element | null;
  description?: string | JSX.Element;
};

const Item: React.FC<PreviewListItemProps> = (props) => {
  const { key, title, description } = props;

  return (
    <li key={key} className="py-1">
      <span className="text-lg">{title}</span>
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
