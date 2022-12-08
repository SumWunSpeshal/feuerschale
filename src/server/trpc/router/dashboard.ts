import { authedProcedure, t } from "src/server/trpc/trpc";

export const dashboardRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    return prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      include: {
        texts: {
          orderBy: {
            created_at: "desc",
          },
          take: 6,
        },
        Venue: {
          orderBy: {
            created_at: "desc",
          },
          include: {
            City: true,
          },
          take: 6,
        },
        VenueText: {
          orderBy: {
            created_at: "desc",
          },
          take: 6,
          include: {
            Venue: true,
            Text: true,
          },
        },
      },
    });
  }),
});
