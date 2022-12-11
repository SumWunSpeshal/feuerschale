import clsx from "clsx";
import { ForwardedRef, useEffect, useImperativeHandle, useState } from "react";
import { Container } from "./Container";

type State = "success" | "error" | "info";

type SnackbarOpenArgs = {
  message: string;
  state: State;
};

export type SnackbarRef = {
  open: (args: SnackbarOpenArgs) => void;
  close: () => void;
};

type SnackbarProps = {
  snackbarRef?: ForwardedRef<SnackbarRef>;
  timeoutInMs?: number;
};

const stateMap: Record<State, string> = {
  success: "bg-lime-300",
  error: "bg-red-500",
  info: "bg-blue-300",
};

export function Snackbar(props: SnackbarProps) {
  const { snackbarRef, timeoutInMs = 3000 } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [snackBarState, setSnackBarState] = useState<SnackbarOpenArgs>({
    message: "",
    state: "success",
  });

  useImperativeHandle(snackbarRef, () => ({
    open: (args) => {
      setIsOpen(true);
      setSnackBarState(args);
    },
    close: () => setIsOpen(false),
  }));

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = setTimeout(() => {
      setIsOpen(false);
    }, timeoutInMs);

    return () => {
      clearTimeout(timer);
      timer = undefined;
    };
  }, [isOpen, timeoutInMs]);

  return (
    <div
      className={clsx(
        "fixed -top-1 left-0 z-50 w-full transition-transform",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <Container>
        <div
          className={clsx(
            "mt-6 rounded-2xl border-2 border-black p-4 font-bold shadow-brutal",
            stateMap[snackBarState.state]
          )}
        >
          {snackBarState.message}
        </div>
      </Container>
    </div>
  );
}
