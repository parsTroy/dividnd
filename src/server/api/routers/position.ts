import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const positionRouter = createTRPCRouter({
  // Get all positions for a portfolio
  getByPortfolio: protectedProcedure
    .input(z.object({ portfolioId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First verify the portfolio belongs to the user
      const portfolio = await ctx.db.portfolio.findFirst({
        where: {
          id: input.portfolioId,
          userId: ctx.session.user.id,
        },
      });

      if (!portfolio) {
        throw new Error("Portfolio not found");
      }

      return ctx.db.position.findMany({
        where: { portfolioId: input.portfolioId },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Create a new position
  create: protectedProcedure
    .input(z.object({
      portfolioId: z.string(),
      ticker: z.string().min(1).max(10).toUpperCase(),
      shares: z.number().positive(),
      purchasePrice: z.number().positive(),
      purchaseDate: z.date(),
      currentPrice: z.number().positive().optional(),
      dividendYield: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify the portfolio belongs to the user
      const portfolio = await ctx.db.portfolio.findFirst({
        where: {
          id: input.portfolioId,
          userId: ctx.session.user.id,
        },
      });

      if (!portfolio) {
        throw new Error("Portfolio not found");
      }

      return ctx.db.position.create({
        data: {
          portfolioId: input.portfolioId,
          ticker: input.ticker,
          shares: input.shares,
          purchasePrice: input.purchasePrice,
          purchaseDate: input.purchaseDate,
          currentPrice: input.currentPrice,
          dividendYield: input.dividendYield,
        },
      });
    }),

  // Update a position
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      ticker: z.string().min(1).max(10).toUpperCase().optional(),
      shares: z.number().positive().optional(),
      purchasePrice: z.number().positive().optional(),
      purchaseDate: z.date().optional(),
      currentPrice: z.number().positive().optional(),
      dividendYield: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // First verify the position belongs to the user
      const position = await ctx.db.position.findFirst({
        where: {
          id,
          portfolio: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!position) {
        throw new Error("Position not found");
      }

      return ctx.db.position.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete a position
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First verify the position belongs to the user
      const position = await ctx.db.position.findFirst({
        where: {
          id: input.id,
          portfolio: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!position) {
        throw new Error("Position not found");
      }

      return ctx.db.position.delete({
        where: { id: input.id },
      });
    }),

  // Get portfolio summary with calculations
  getPortfolioSummary: protectedProcedure
    .input(z.object({ portfolioId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First verify the portfolio belongs to the user
      const portfolio = await ctx.db.portfolio.findFirst({
        where: {
          id: input.portfolioId,
          userId: ctx.session.user.id,
        },
      });

      if (!portfolio) {
        throw new Error("Portfolio not found");
      }

      const positions = await ctx.db.position.findMany({
        where: { portfolioId: input.portfolioId },
      });

      // Calculate portfolio metrics
      const totalInvested = positions.reduce(
        (sum, pos) => sum + (pos.shares * pos.purchasePrice),
        0
      );

      const totalCurrentValue = positions.reduce(
        (sum, pos) => sum + (pos.shares * (pos.currentPrice ?? pos.purchasePrice)),
        0
      );

      const totalUnrealizedGainLoss = totalCurrentValue - totalInvested;
      const totalUnrealizedGainLossPercent = totalInvested > 0 
        ? (totalUnrealizedGainLoss / totalInvested) * 100 
        : 0;

      const totalAnnualDividends = positions.reduce(
        (sum, pos) => {
          const annualDividend = pos.shares * (pos.purchasePrice * (pos.dividendYield ?? 0) / 100);
          return sum + annualDividend;
        },
        0
      );

      const portfolioDividendYield = totalCurrentValue > 0 
        ? (totalAnnualDividends / totalCurrentValue) * 100 
        : 0;

      return {
        portfolio,
        positions,
        summary: {
          totalInvested,
          totalCurrentValue,
          totalUnrealizedGainLoss,
          totalUnrealizedGainLossPercent,
          totalAnnualDividends,
          portfolioDividendYield,
          positionCount: positions.length,
        },
      };
    }),
});
