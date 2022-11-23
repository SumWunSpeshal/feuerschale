// src/server/trpc/router/index.ts
import { t } from "src/server/trpc/trpc";
import { authRouter } from "./auth";
import { cityRouter } from "./cityRouter";
import { exampleRouter } from "./example";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  city: cityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
