import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { Icon } from "./Icon";

type FloatingNavProps = Record<string, unknown>;

export function FloatingNav(props: FloatingNavProps) {
  const {} = props;

  return (
    <aside className="fixed bottom-4 left-4">
      <Button.Anchor href="/">
        <Icon icon={faArrowLeft}></Icon>
      </Button.Anchor>
    </aside>
  );
}
