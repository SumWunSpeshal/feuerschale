import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const invoiceRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        showId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.invoice.create({
        data: {
          userId: ctx.session.user.id,
          showId: input.showId,
          issued: false,
          settled: false,
        },
      });
    }),
  delete: authedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma } = ctx;

      return prisma.invoice.delete({
        where: {
          id: input.invoiceId,
        },
      });
    }),
});
