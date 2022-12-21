import { Session } from "next-auth";
import { downloadFromBlob } from "src/utils/download-from-blob";
import { pipe } from "src/utils/pipe";
import {
  removeAccents,
  removeSpaces,
  replaceUmlauts,
  trim,
} from "src/utils/string-helpers";
import { assertUserBucketExists, supabase } from "src/utils/supabase";

export async function maybeUploadInvoice({
  userId,
  showId,
  file,
  fileName,
}: {
  userId?: string | null;
  showId?: string | null;
  file?: File | undefined;
  fileName?: string | null;
}) {
  if (userId && file && showId) {
    await assertUserBucketExists(userId);
    await supabase.storage
      .from(userId)
      .upload(`invoices/${showId}/${fileName}`, file, {
        contentType: "application/pdf",
      })
      .then(console.log)
      .catch(console.warn);
  }
}

export async function downloadInvoice(
  userId: string,
  showId: string,
  fileName: string
) {
  await supabase.storage
    .from(userId)
    .download(`invoices/${showId}/${fileName}`)
    .then(({ data, error }) => {
      if (error) {
        return console.warn("getting file from storage failed", error);
      }

      if (data) {
        downloadFromBlob(data, fileName);
      }
    })
    .catch(console.warn);
}

export async function deleteInvoice(
  userId: string,
  showId: string,
  fileName: string
) {
  await supabase.storage
    .from(userId)
    .remove([`invoices/${showId}/${fileName}`])
    .then(console.log)
    .catch(console.warn);
}

export async function maybeGetInvoiceFileNames(sessionData?: Session | null) {
  if (sessionData?.user?.id) {
    await supabase.storage
      .from(sessionData.user.id)
      .list("invoices")
      .then(console.log)
      .catch(console.warn);
  }
}

export function formatFileName(fileName: string) {
  return pipe(
    fileName,
    (str) => replaceUmlauts(str),
    (str) => removeAccents(str),
    (str) => trim(str),
    (str) => removeSpaces(str)
  );
}