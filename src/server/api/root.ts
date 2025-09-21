import { postRouter } from "~/server/api/routers/post";
import { portfolioRouter } from "~/server/api/routers/portfolio";
import { positionRouter } from "~/server/api/routers/position";
import { stockRouter } from "~/server/api/routers/stock";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  portfolio: portfolioRouter,
  position: positionRouter,
  stock: stockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
