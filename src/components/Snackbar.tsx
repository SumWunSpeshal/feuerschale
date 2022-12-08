import clsx from "clsx";
import {
  ForwardedRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Container } from "./Container";

export type SnackbarRef = {
  open: () => void;
  close: () => void;
};

type SnackbarProps = PropsWithChildren<{
  state?: "success" | "error" | "info";
  snackbarRef?: ForwardedRef<SnackbarRef>;
  timeoutInMs?: number;
}>;

const stateMap: Record<NonNullable<SnackbarProps["state"]>, string> = {
  success: "bg-lime-400",
  error: "bg-red-600",
  info: "bg-blue-400",
};

export function Snackbar(props: SnackbarProps) {
  const {
    children,
    snackbarRef,
    state = "success",
    timeoutInMs = 3000,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(snackbarRef, () => ({
    open: () => setIsOpen(true),
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
            stateMap[state]
          )}
        >
          {children}
        </div>
      </Container>
    </div>
  );
}
