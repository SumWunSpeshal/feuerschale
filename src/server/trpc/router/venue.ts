import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const venueRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        cityId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      return prisma.venue.create({
        data: {
          userId: session.user.id,
          cityId: input.cityId,
          name: input.name,
          description: input.description,
        },
      });
    }),
  update: authedProcedure
    .input(
      z.object({
        venueId: z.number(),
        cityId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.venue.update({
        where: {
          id: input.venueId,
        },
        data: {
          cityId: input.cityId,
          name: input.name,
          description: input.description,
        },
      });
    }),
  delete: authedProcedure
    .input(
      z.object({
        venueId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma } = ctx;

      return prisma.venue.delete({
        where: {
          id: input.venueId,
        },
      });
    }),
  getOne: authedProcedure
    .input(
      z.object({
        venueId: z.union([z.number(), z.string(), z.nan()]).optional(),
      })
    )
    .query(({ input, ctx }) => {
      if (!input.venueId || !+input.venueId) {
        return null;
      }

      return ctx.prisma.venue.findFirst({
        where: {
          AND: [
            {
              userId: {
                equals: ctx.session.user.id,
              },
            },
            {
              id: {
                equals: +input.venueId,
              },
            },
          ],
        },
        include: {
          VenueText: {
            include: {
              Text: true,
            },
          },
          City: true,
        },
      });
    }),
  getAll: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.venue.findMany({
      orderBy: {
        City: {
          Stadt: "asc",
        },
      },
      where: {
        userId: {
          equals: ctx.session?.user?.id,
        },
      },
      include: {
        VenueText: {
          include: {
            Text: true,
          },
          distinct: ["textId"],
        },
        City: true,
      },
    });
  }),
});
