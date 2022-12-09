import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const showRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        venueId: z.number(),
        textIds: z.string().array(),
        date: z.date().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      return prisma.show.create({
        data: {
          userId: session.user.id,
          date: input.date || new Date(),
          VenueText: {
            create: input.textIds.map((textId) => ({
              userId: session.user.id,
              venueId: input.venueId,
              textId,
            })),
          },
        },
      });
    }),
  addTexts: authedProcedure
    .input(
      z.object({
        showId: z.string(),
        venueId: z.number(),
        textIds: z.string().array(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      return prisma.show.update({
        where: {
          id: input.showId,
        },
        data: {
          VenueText: {
            create: input.textIds.map((textId) => ({
              userId: session.user.id,
              venueId: input.venueId,
              textId,
            })),
          },
        },
      });
    }),
  delete: authedProcedure
    .input(
      z.object({
        showId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.show.delete({
        where: {
          id: input.showId,
        },
      });
    }),
  getAll: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.show.findMany({
      where: {
        userId: {
          equals: ctx.session?.user?.id,
        },
      },
    });
  }),
  getOne: authedProcedure
    .input(
      z.object({
        showId: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      if (!input.showId) {
        return null;
      }

      return ctx.prisma.venueText.findFirst({
        where: {
          id: input.showId,
        },
      });
    }),
});
