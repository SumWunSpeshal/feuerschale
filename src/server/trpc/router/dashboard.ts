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
          take: 5,
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
        Show: {
          orderBy: {
            date: "desc",
          },
          take: 4,
          include: {
            VenueText: {
              select: {
                Text: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                Venue: {
                  select: {
                    name: true,
                    City: {
                      select: {
                        Stadt: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Invoice: {
          include: {
            Show: {
              include: {
                VenueText: {
                  select: {
                    Text: {
                      select: {
                        name: true,
                      },
                    },
                    Venue: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }),
});
