import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AnchorButton } from "./AnchorButton";
import { Icon } from "./Icon";

type FloatingNavProps = Record<string, unknown>;

export function FloatingNav(props: FloatingNavProps) {
  const {} = props;

  return (
    <aside className="fixed bottom-4 left-4">
      <AnchorButton href="/">
        <Icon icon={faArrowLeft}></Icon>
      </AnchorButton>
    </aside>
  );
}
