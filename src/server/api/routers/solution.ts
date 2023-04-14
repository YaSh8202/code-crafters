import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getScreenshot } from "~/server/helpers/cloudinaryHelper";

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
    .mutation(async ({ input, ctx }) => {
      let image = undefined;
      if (input.liveURL) {
        try {
          image = await getScreenshot(input.liveURL);
        } catch (error) {
          console.log(error);
        }
      }
      console.log("imageURL", image);
      return ctx.prisma.solution.create({
        data: {
          title: input.title,
          description: input.description,
          repoURL: input.repoURL,
          liveURL: input.liveURL,
          challengeId: input.challengeId,
          userId: ctx.session.user.id,
          tags: input.tags,
          image: image,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.solution.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        challenge: {
          select: {
            type: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.solution.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
          createdAt: true,
          liveURL: true,
        image: true,
        repoURL: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
          challenge: {
            select: {
              type: true,
              title: true,
              slug: true,
              imagesURL: true,
              difficulty: true,
            },
          },
        },
      });
    }),
});
