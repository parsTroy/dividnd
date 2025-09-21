import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const portfolioRouter = createTRPCRouter({
  // Get all portfolios for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const portfolios = await ctx.db.portfolio.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        positions: true,
        _count: {
          select: { positions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Sort portfolios with main portfolio first
    return portfolios.sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return 0;
    });
  }),

  // Get the main portfolio for the current user
  getMain: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.portfolio.findFirst({
      where: { 
        userId: ctx.session.user.id,
        isMain: true 
      },
      include: {
        positions: true,
        _count: {
          select: { positions: true },
        },
      },
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
      // Check if this is the user's first portfolio
      const existingPortfolios = await ctx.db.portfolio.count({
        where: { userId: ctx.session.user.id }
      });

      return ctx.db.portfolio.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          isMain: existingPortfolios === 0, // First portfolio becomes main
        },
      });
    }),

  // Set a portfolio as the main portfolio
  setMain: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First, unset all other portfolios as main
      await ctx.db.portfolio.updateMany({
        where: { 
          userId: ctx.session.user.id,
          isMain: true 
        },
        data: { isMain: false }
      });

      // Then set the selected portfolio as main
      return ctx.db.portfolio.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: { isMain: true },
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
