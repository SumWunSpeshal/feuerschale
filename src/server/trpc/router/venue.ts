import { t } from "src/server/trpc/trpc";
import { z } from "zod";

export const venueRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        cityId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;

      if (!session?.user?.id) {
        return null;
      }

      return prisma.venue.create({
        data: {
          userId: session.user.id,
          cityId: input.cityId,
          name: input.name,
          description: input.description,
        },
      });
    }),
  delete: t.procedure
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
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.venue.findMany({
      where: {
        userId: {
          equals: ctx.session?.user?.id,
        },
      },
    });
  }),
});
