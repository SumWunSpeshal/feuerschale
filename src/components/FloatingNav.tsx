import { faHomeLgAlt, faList } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { Icon } from "./Icon";

type FloatingNavProps = {
  hrefToListView?: string;
};

export function FloatingNav(props: FloatingNavProps) {
  const { hrefToListView } = props;

  return (
    <aside className="fixed bottom-4 -left-1 -translate-x-full animate-floating-nav">
      <div className="flex flex-col gap-3 pl-5">
        {hrefToListView && (
          <div>
            <Button.Anchor href={hrefToListView} className="group">
              <Icon icon={faList} size={24} />
            </Button.Anchor>
          </div>
        )}
        <div>
          <Button.Anchor href="/" className="group">
            <Icon icon={faHomeLgAlt} size={24} />
          </Button.Anchor>
        </div>
      </div>
    </aside>
  );
}
