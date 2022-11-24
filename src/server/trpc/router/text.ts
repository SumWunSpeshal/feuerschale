import { t } from "src/server/trpc/trpc";
import { z } from "zod";

export const textRouter = t.router({
  create: t.procedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
    .mutation(({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { name, description } = input;

      if (!session?.user?.id) {
        return null;
      }

      return prisma.text.create({
        data: {
          userId: session.user.id,
          name,
          description: description ?? "",
        },
      });
    }),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.text.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    const { prisma, session } = ctx;
    return prisma.text.findMany({
      where: {
        userId: {
          equals: session?.user?.id,
        },
      },
    });
  }),
});
