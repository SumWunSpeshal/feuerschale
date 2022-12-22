import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { noop } from "src/utils/noop";
import { Url } from "url";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Modal, useModalRef } from "./Modal";

type CardProps = PropsWithChildren<{
  header?: string | JSX.Element | JSX.Element[];
  hrefToDetailPage: Url | string;
  onDelete?: () => void;
  deleteModalChildren?: string | JSX.Element | JSX.Element[];
}>;

export function Card(props: CardProps) {
  const { children, header, onDelete, hrefToDetailPage, deleteModalChildren } =
    props;

  const modalRef = useModalRef();

  return (
    <div className="rounded-md border-2 border-gray-500 bg-gray-100 transition-shadow [&:has(.child:hover)]:shadow-brutal-gray-500">
      <div
        className={clsx(
          "flex flex-col gap-4 py-2 px-3 sm:flex-row",
          !!children && "items-start"
        )}
      >
        <Link href={hrefToDetailPage} className="child grow select-none">
          <header>
            <strong>{header}</strong>
          </header>
          <div>{children}</div>
        </Link>
        <div className="flex gap-2">
          {onDelete && (
            <Button
              onClick={() => modalRef.current?.open()}
              className="!bg-red-500"
            >
              <Icon icon={faTrashCan} />
              <span className="sr-only">Löschen</span>
            </Button>
          )}
        </div>
      </div>

      <Modal.Confirm modalRef={modalRef} onConfirm={onDelete || noop}>
        {deleteModalChildren}
      </Modal.Confirm>
    </div>
  );
}
