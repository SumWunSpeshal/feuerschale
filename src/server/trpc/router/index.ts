// src/server/trpc/router/index.ts
import { t } from "src/server/trpc/trpc";
import { authRouter } from "./auth";
import { cityRouter } from "./city";
import { textRouter } from "./text";
import { venueRouter } from "./venue";

export const appRouter = t.router({
  auth: authRouter,
  city: cityRouter,
  text: textRouter,
  venue: venueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
