import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const SolutionRouter = createTRPCRouter({
  getAllByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.submission.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getAllByChallenge: publicProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.submission.findMany({
        where: {
          challengeId: input.challengeId,
        },
      });
    }),
});
