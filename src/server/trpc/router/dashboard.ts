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
          take: 3,
        },
        Venue: {
          orderBy: {
            created_at: "desc",
          },
          include: {
            City: {
              select: {
                Stadt: true,
              },
            },
          },
          take: 3,
        },
        VenueText: {
          orderBy: {
            created_at: "desc",
          },
          take: 3,
          include: {
            Venue: {
              select: {
                name: true,
              },
            },
            Text: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }),
});
