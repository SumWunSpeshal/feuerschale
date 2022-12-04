import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const venueTextRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        venueId: z.number(),
        textId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      return prisma.venueText.create({
        data: {
          userId: session.user.id,
          textId: input.textId,
          venueId: input.venueId,
        },
      });
    }),
  delete: authedProcedure
    .input(
      z.object({
        venueTextId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.venueText.delete({
        where: {
          id: input.venueTextId,
        },
      });
    }),
  getAll: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.venueText.findMany({
      where: {
        userId: {
          equals: ctx.session?.user?.id,
        },
      },
    });
  }),
});
