import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const showRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        venueId: z.number(),
        textIds: z.string().array(),
        date: z.date(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      return prisma.show.create({
        data: {
          userId: session.user.id,
          date: input.date,
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
  update: authedProcedure
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
      orderBy: {
        date: "desc",
      },
      where: {
        userId: {
          equals: ctx.session?.user?.id,
        },
      },
      include: {
        VenueText: {
          select: {
            Venue: {
              include: {
                City: true,
              },
            },
            Text: true,
          },
        },
        Invoice: true,
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

      return ctx.prisma.show.findFirst({
        where: {
          id: input.showId,
        },
      });
    }),
});