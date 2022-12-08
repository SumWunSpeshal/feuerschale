// src/server/trpc/router/index.ts
import { t } from "src/server/trpc/trpc";
import { authRouter } from "./auth";
import { cityRouter } from "./city";
import { dashboardRouter } from "./dashboard";
import { invoiceRouter } from "./invoice";
import { textRouter } from "./text";
import { venueRouter } from "./venue";
import { venueTextRouter } from "./venueText";

export const appRouter = t.router({
  auth: authRouter,
  dashboard: dashboardRouter,
  city: cityRouter,
  text: textRouter,
  venue: venueRouter,
  venueText: venueTextRouter,
  invoice: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
