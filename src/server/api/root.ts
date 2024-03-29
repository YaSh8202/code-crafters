import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "./routers/challenge";
import { SolutionRouter } from "./routers/solution";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  challenge: challengeRouter,
  solution: SolutionRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
