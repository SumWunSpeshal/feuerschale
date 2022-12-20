import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { BrutalElevation } from "./BrutalElevation";
import { Button } from "./Button";
import { Icon } from "./Icon";

type DownloadPreviewProps = PropsWithChildren<{
  title: string;
  onDownload?: () => void;
  onDelete?: () => void;
}>;

export function DownloadPreview(props: DownloadPreviewProps) {
  const { title, children, onDownload, onDelete } = props;

  return (
    <div className="relative">
      <BrutalElevation className="!top-3 !h-[calc(100%-0.75rem)] !rounded-md">
        <fieldset className="relative z-10 rounded-md border-2 border-black bg-amber-100 px-4 pb-6 pt-2">
          <legend className="px-2">
            <strong>{title}</strong>
          </legend>
          <div className="flex flex-col items-start gap-4 px-2 sm:flex-row md:gap-6">
            <div className="mr-auto flex gap-x-4 md:gap-x-6">
              <div>
                <Icon icon={faFile} size={32} className="text-indigo-400" />
              </div>
              <div>{children}</div>
            </div>
            <div className="flex gap-2">
              {onDownload && (
                <Button onClick={onDownload}>
                  <Icon
                    icon={faDownload}
                    aria-label="Herunterladen"
                    size={16}
                  />
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} className="bg-red-400">
                  <Icon icon={faTrashCan} aria-label="Löschen" size={16} />
                </Button>
              )}
            </div>
          </div>
        </fieldset>
      </BrutalElevation>
    </div>
  );
}
