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
        slug: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const challengeId = await ctx.prisma.challenge.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
        },
      });

      if (!challengeId) {
        throw new Error("Challenge not found");
      }
      return ctx.prisma.solution.create({
        data: {
          title: input.title,
          description: input.description,
          repoURL: input.repoURL,
          liveURL: input.liveURL,
          challengeId: challengeId.id,
          userId: ctx.session.user.id,
          tags: input.tags,
          image: input.image,
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
        image: true,
        voteValue: true,
        _count: {
          select: {
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
          voteValue: true,
          _count: {
            select: {
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

  upvote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voteExist = await ctx.prisma.vote.findUnique({
        where: {
          solutionId_userId: {
            userId: ctx.session.user.id,
            solutionId: input.id,
          },
        },
      });

      if (voteExist) {
        if (voteExist.voteType === 1)
          return ctx.prisma.solution.update({
            where: {
              id: input.id,
            },
            data: {
              voteValue: {
                decrement: 1,
              },
              votes: {
                delete: {
                  solutionId_userId: {
                    userId: ctx.session.user.id,
                    solutionId: input.id,
                  },
                },
              },
            },
          });

        return ctx.prisma.solution.update({
          where: {
            id: input.id,
          },
          data: {
            voteValue: {
              increment: 2,
            },
            votes: {
              update: {
                where: {
                  solutionId_userId: {
                    userId: ctx.session.user.id,
                    solutionId: input.id,
                  },
                },
                data: {
                  voteType: 1,
                },
              },
            },
          },
        });
      }

      return ctx.prisma.solution.update({
        where: {
          id: input.id,
        },
        data: {
          voteValue: {
            increment: 1,
          },
          votes: {
            create: {
              userId: ctx.session.user.id,
              voteType: 1,
            },
          },
        },
      });
    }),

  downvote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voteExist = await ctx.prisma.vote.findUnique({
        where: {
          solutionId_userId: {
            userId: ctx.session.user.id,
            solutionId: input.id,
          },
        },
      });

      if (voteExist) {
        if (voteExist.voteType === -1) {
          return ctx.prisma.solution.update({
            where: {
              id: input.id,
            },
            data: {
              voteValue: {
                increment: 1,
              },
              votes: {
                delete: {
                  solutionId_userId: {
                    userId: ctx.session.user.id,
                    solutionId: input.id,
                  },
                },
              },
            },
          });
        } else {
          return ctx.prisma.solution.update({
            where: {
              id: input.id,
            },
            data: {
              voteValue: {
                decrement: 2,
              },
              votes: {
                update: {
                  where: {
                    solutionId_userId: {
                      userId: ctx.session.user.id,
                      solutionId: input.id,
                    },
                  },
                  data: {
                    voteType: -1,
                  },
                },
              },
            },
          });
        }
      }

      return ctx.prisma.solution.update({
        where: {
          id: input.id,
        },
        data: {
          voteValue: {
            decrement: 1,
          },
          votes: {
            create: {
              userId: ctx.session.user.id,
              voteType: -1,
            },
          },
        },
      });
    }),

  // user has voted on the solution
  voteValueForUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user)
        return {
          voteValue: 0,
        };
      const voteExist = await ctx.prisma.vote.findUnique({
        where: {
          solutionId_userId: {
            userId: ctx.session.user.id,
            solutionId: input.id,
          },
        },
      });
      return {
        voteValue: voteExist?.voteType || 0,
      };
    }),

  getComments: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.comment.findMany({
        where: {
          solutionId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select:{
          id: true,
          text: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              image : true,
              name: true,
            }
          },
          parentCommentId: true,
        }
      });
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        solId: z.string(),
        text: z.string(),
        parentCommentId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          text: input.text,
          parentCommentId: input.parentCommentId,
          userId: ctx.session.user.id,
          solutionId: input.solId,
        },
      });
    }),
});
