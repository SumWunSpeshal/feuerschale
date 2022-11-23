import { t } from "src/server/trpc/trpc";
import { z } from "zod";

export const cityRouter = t.router({
  search: t.procedure
    .input(z.object({ text: z.string().nullish() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.city.findMany({
        where: {
          OR: [
            {
              Stadt: {
                contains: input?.text || "",
                mode: "insensitive",
              },
            },
            {
              PLZ: {
                contains: input?.text || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.city.findMany();
  }),
});
