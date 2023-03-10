import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "./routers/challenge";
import { SolutionRouter } from "./routers/solution";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  challenge: challengeRouter,
  solution: SolutionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
