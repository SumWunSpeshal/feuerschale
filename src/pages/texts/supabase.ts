import { Session } from "next-auth";
import { supabase } from "src/utils/supabase";

export async function maybeUploadSlamText(
  sessionData?: Session | null,
  file?: File | undefined,
  fileName?: string
) {
  if (sessionData?.user?.id && file && fileName) {
    await supabase.storage
      .from(sessionData.user.id)
      .upload(`slam-texts/${fileName}`, file, {
        contentType: "application/pdf",
      })
      .then(console.log)
      .catch(console.warn);
  }
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
