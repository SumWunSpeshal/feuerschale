import { authedProcedure, t } from "src/server/trpc/trpc";
import { z } from "zod";

export const textRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        slamTextFileName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { name, description, slamTextFileName } = input;

      return prisma.text.create({
        data: {
          userId: session.user.id,
          name,
          description: description ?? "",
          slamTextFileName,
        },
      });
    }),
  delete: authedProcedure
    .input(z.object({ id: z.string(), slamTextFileName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { session, prisma, supabase } = ctx;

      await supabase.storage
        .from(session.user.id)
        .remove([`slam-texts/${input.slamTextFileName}`])
        .then(console.log)
        .catch(console.warn);

      return prisma.text.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: authedProcedure.query(async ({ ctx }) => {
    const { prisma, session, supabase } = ctx;

    if (!(await supabase.storage.getBucket(session.user.id)).data) {
      await supabase.storage
        .createBucket(session.user.id)
        .then(console.log)
        .catch(console.warn);
    }

    return prisma.text.findMany({
      where: {
        userId: {
          equals: session?.user?.id,
        },
      },
    });
  }),
});
