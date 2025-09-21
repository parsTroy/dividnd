import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const portfolioRouter = createTRPCRouter({
  // Get all portfolios for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.portfolio.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        positions: true,
        _count: {
          select: { positions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get a specific portfolio by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.portfolio.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          positions: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  // Create a new portfolio
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.portfolio.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Update portfolio name
  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string().min(1).max(100)
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.portfolio.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  // Delete a portfolio
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.portfolio.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});
