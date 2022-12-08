import { faHomeLgAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { Icon } from "./Icon";

type FloatingNavProps = Record<string, unknown>;

export function FloatingNav(props: FloatingNavProps) {
  const {} = props;

  return (
    <aside className="fixed bottom-4 -left-1 -translate-x-full animate-floating-nav">
      <div className="pl-5">
        <Button.Anchor href="/">
          <Icon icon={faHomeLgAlt} size={24}></Icon>
        </Button.Anchor>
      </div>
    </aside>
  );
}
