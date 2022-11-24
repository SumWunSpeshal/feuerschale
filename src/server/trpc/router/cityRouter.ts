import { t } from "src/server/trpc/trpc";
import { z } from "zod";

export const cityRouter = t.router({
  searchCities: t.procedure
    .input(z.object({ value: z.string().nullish() }))
    .mutation(({ input, ctx }) => {
      return !input.value
        ? undefined
        : ctx.prisma.city.findMany({
            take: 10,
            where: {
              OR: [
                {
                  Stadt: {
                    contains: input.value,
                    mode: "insensitive",
                  },
                },
                {
                  PLZ: {
                    contains: input.value,
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
