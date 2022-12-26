import { Session } from "next-auth";
import { downloadFromBlob } from "src/utils/download-from-blob";
import { assertUserBucketExists, supabase } from "src/utils/supabase";

export async function maybeUploadSlamText({
  userId,
  textId,
  file,
  fileName,
}: {
  userId?: string | null;
  textId?: string | null;
  file?: File | undefined;
  fileName?: string | null;
}) {
  if (userId && file && textId) {
    await assertUserBucketExists(userId);
    await supabase.storage
      .from(userId)
      .upload(`slam-texts/${textId}/${fileName}`, file, {
        contentType: "application/pdf",
      })
      .then(console.log)
      .catch(console.warn);
  }
}

export async function downloadSlamText({
  userId,
  slamTextId,
  fileName,
}: {
  userId: string;
  slamTextId: string;
  fileName: string;
}) {
  await supabase.storage
    .from(userId)
    .download(`slam-texts/${slamTextId}/${fileName}`)
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

export async function deleteSlamText({
  userId,
  slamTextId,
  fileName,
}: {
  userId: string;
  slamTextId: string;
  fileName: string;
}) {
  await supabase.storage
    .from(userId)
    .remove([`slam-texts/${slamTextId}/${fileName}`])
    .then(console.log)
    .catch(console.warn);
}

export async function maybeGetSlamTextNames(sessionData?: Session | null) {
  if (sessionData?.user?.id) {
    await supabase.storage
      .from(sessionData.user.id)
      .list("slam-texts")
      .then(console.log)
      .catch(console.warn);
  }
}

export async function createSignedUrl({
  userId,
  slamTextId,
  fileName,
}: {
  userId: string;
  slamTextId: string;
  fileName: string;
}) {
  return supabase.storage
    .from(userId)
    .createSignedUrl(`slam-texts/${slamTextId}/${fileName}`, 60);
}
