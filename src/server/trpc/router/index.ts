// src/server/trpc/router/index.ts
import { t } from "src/server/trpc/trpc";
import { authRouter } from "./auth";
import { cityRouter } from "./city";
import { exampleRouter } from "./example";
import { textRouter } from "./text";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  city: cityRouter,
  text: textRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
