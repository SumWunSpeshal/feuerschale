import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "src/env/schema.mjs";
import { downloadFromBlob } from "src/utils/download-from-blob";

type FileDirectory = "invoices" | "slam-texts";

export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function assertUserBucketExists(userId?: string) {
  if (!userId) {
    return;
  }

  if ((await supabase.storage.getBucket(userId)).data) {
    return;
  }

  await supabase.storage
    .createBucket(userId)
    .then(console.log)
    .catch(console.warn);
}

export async function maybeUploadFile({
  dir,
  userId,
  entityId,
  file,
  fileName,
}: {
  dir: FileDirectory;
  userId?: string | null;
  entityId?: string | null;
  file?: File | undefined;
  fileName?: string | null;
}) {
  if (userId && file && entityId) {
    await assertUserBucketExists(userId);
    await supabase.storage
      .from(userId)
      .upload(`${dir}/${entityId}/${fileName}`, file, {
        contentType: "application/pdf",
      })
      .then(console.log)
      .catch(console.warn);
  }
}

export async function downloadFile({
  dir,
  userId,
  entityId,
  fileName,
}: {
  dir: FileDirectory;
  userId: string;
  entityId: string;
  fileName: string;
}) {
  await supabase.storage
    .from(userId)
    .download(`${dir}/${entityId}/${fileName}`)
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

export async function deleteFile({
  dir,
  userId,
  entityId,
  fileName,
}: {
  dir: FileDirectory;
  userId: string;
  entityId: string;
  fileName: string;
}) {
  await supabase.storage
    .from(userId)
    .remove([`${dir}/${entityId}/${fileName}`])
    .then(console.log)
    .catch(console.warn);
}

export async function maybeGetEntityFileNames({
  dir,
  userId,
}: {
  dir: FileDirectory;
  userId: string;
}) {
  if (userId) {
    await supabase.storage
      .from(userId)
      .list(dir)
      .then(console.log)
      .catch(console.warn);
  }
}

export async function createSignedUrl({
  dir,
  userId,
  slamTextId,
  fileName,
}: {
  dir: FileDirectory;
  userId: string;
  slamTextId: string;
  fileName: string;
}) {
  return supabase.storage
    .from(userId)
    .createSignedUrl(`${dir}/${slamTextId}/${fileName}`, 60);
}
