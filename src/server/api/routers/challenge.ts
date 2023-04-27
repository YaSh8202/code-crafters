import { ChallengeType, Difficulty } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { shortDescGenerator } from "~/server/helpers/openaiHelper";

export const challengeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        shortDesc: true,
        imagesURL: true,
        difficulty: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            stars: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.nativeEnum(ChallengeType),
        difficulty: z.nativeEnum(Difficulty),
        briefDesc: z.string(),
        imagesURL: z.array(z.string()),
        videoURL: z.optional(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const slug =
        input.title.toLowerCase().replace(/ /g, "-") + "-" + generateUID();

      const shortDesc = await shortDescGenerator(
        input.title,
        input.type,
        input.difficulty,
        input.briefDesc
      );

      return ctx.prisma.challenge.create({
        data: {
          title: input.title,
          type: input.type,
          shortDesc: shortDesc,
          briefDesc: input.briefDesc,
          imagesURL: input.imagesURL,
          videoURL: input.videoURL,
          userId: ctx.session.user.id,
          difficulty: input.difficulty,
          slug: slug,
        },
      });
    }),

  getAllByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        type: true,
        shortDesc: true,
        imagesURL: true,
        difficulty: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            stars: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.challenge.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.challenge.findUnique({
        where: {
          slug: input.slug,
        },
      });
    }),

  getChallengeIdBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.challenge.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
        },
      });
    }),

  toggleStar: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const challenge = await ctx.prisma.challenge.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          stars: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!challenge) {
        throw new Error("Challenge not found");
      }
      if (challenge.stars.find((user) => user.id === ctx.session.user.id)) {
        return ctx.prisma.challenge.update({
          where: {
            slug: input.slug,
          },
          data: {
            stars: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }

      return ctx.prisma.challenge.update({
        where: {
          slug: input.slug,
        },
        data: {
          stars: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  isStarred: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {

      const challenge = await ctx.prisma.challenge.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          _count: {
            select: {
              stars: true,
            },
          },
          stars: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!challenge) {
        return {
          isStarred: false,
          stars: 0
        }
      }
      if (
        ctx.session?.user &&
        challenge.stars.find((user) => user.id === ctx.session?.user.id)
      ) {
        return {
          isStarred: true,
          stars: challenge._count.stars,
        };
      }
      return {
        isStarred: false,
        stars: challenge._count.stars,
      };
    }),
});

function generateUID() {
  let firstPart: string | number = (Math.random() * 46656) | 0;
  let secondPart: string | number = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}
