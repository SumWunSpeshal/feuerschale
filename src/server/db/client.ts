// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { clientEnv } from "src/env/schema.mjs";
import { env } from "src/env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var supabase: SupabaseClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Supabase
export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.supabase = supabase;
}
