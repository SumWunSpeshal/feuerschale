import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "src/env/schema.mjs";

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
