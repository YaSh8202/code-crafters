import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const SolutionRouter = createTRPCRouter({
  getAllByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.solution.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getAllByChallenge: publicProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.solution.findMany({
        where: {
          challengeId: input.challengeId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.optional(z.string()),
        repoURL: z.string(),
        liveURL: z.optional(z.string()),
        challengeId: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.solution.create({
        data: {
          title: input.title,
          description: input.description,
          repoURL: input.repoURL,
          liveURL: input.liveURL,
          challengeId: input.challengeId,
          userId: ctx.session.user.id,
          tags: input.tags,
        },
      });
    }),
});
