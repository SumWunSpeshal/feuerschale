import { faClose } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  PropsWithChildren,
  RefObject,
  useImperativeHandle,
  useState,
} from "react";
import useKeyup from "src/hooks/useKeyup";
import { Button } from "./Button";
import { Fab } from "./Fab";

export type ModalRef = {
  open: () => void;
  close: () => void;
};

type ModalProps = PropsWithChildren<{
  modalRef: RefObject<ModalRef>;
  defaultIsOpen?: boolean;
  heading: string | JSX.Element;
}>;

export function Modal(props: ModalProps) {
  const { defaultIsOpen, children, heading, modalRef } = props;
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  useKeyup("Escape", () => setIsOpen(false));

  useImperativeHandle(modalRef, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center transition-colors",
        isOpen ? "pointer-events-auto bg-black/50" : "pointer-events-none"
      )}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={clsx(
          "absolute top-full left-1/2 w-full max-w-md -translate-x-1/2 px-4 transition-all md:box-content md:px-6",
          isOpen ? "top-1/2 -translate-y-1/2" : "translate-y-full"
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="rounded-3xl border-2 border-black bg-white"
        >
          <div className="rounded-t-3xl border-b-2 border-black bg-yellow-300 pl-6 pr-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{heading}</h3>
              <Fab
                icon={faClose}
                className="text-red-600"
                size={16}
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ConfirmModalProps = PropsWithChildren<{
  modalRef: RefObject<ModalRef>;
  onConfirm: () => void;
}>;

function Confirm(props: ConfirmModalProps) {
  const { children, modalRef, onConfirm } = props;

  return (
    <Modal modalRef={modalRef} heading="Bist Du sicher?">
      <div className="mb-6">{children}</div>
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => modalRef.current?.close()}
          className="!bg-gray-200"
        >
          Abbrechen
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            modalRef.current?.close();
          }}
        >
          Bestätigen
        </Button>
      </div>
    </Modal>
  );
}

Modal.Confirm = Confirm;
