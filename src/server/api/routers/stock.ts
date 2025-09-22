import { z } from "zod";
import { stockAPI } from "~/lib/stock-api";
import { stockCache } from "~/lib/stock-cache";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  // Get cached stock data for a single symbol (with smart caching)
  getStockData: publicProcedure
    .input(z.object({ symbol: z.string().toUpperCase() }))
    .query(async ({ input }) => {
      const data = await stockCache.getStockData(input.symbol);
      return data;
    }),

  // Get cached stock data for multiple symbols
  getMultipleStockData: publicProcedure
    .input(z.object({ symbols: z.array(z.string().toUpperCase()) }))
    .query(async ({ input }) => {
      const data = await stockCache.getMultipleStockData(input.symbols);
      return data;
    }),

  // Get all cached stock data (for suggestions)
  getAllCachedStocks: publicProcedure
    .query(async ({ ctx }) => {
      const stocks = await ctx.db.stockData.findMany({
        where: {
          lastUpdated: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: {
          lastUpdated: 'desc'
        }
      });
      return stocks;
    }),

  // Get cached dividend data for a symbol
  getDividendData: publicProcedure
    .input(z.object({ symbol: z.string().toUpperCase() }))
    .query(async ({ input }) => {
      const data = await stockCache.getDividendData(input.symbol);
      return data;
    }),

  // Get rate limit status for all APIs
  getRateLimitStatus: protectedProcedure
    .query(() => {
      return stockAPI.getRateLimitStatus();
    }),

  // Refresh stock prices for a portfolio (protected) - uses cached data
  refreshPortfolioPrices: protectedProcedure
    .input(z.object({ portfolioId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get all positions in the portfolio
      const positions = await ctx.db.position.findMany({
        where: { portfolioId: input.portfolioId },
        select: { id: true, ticker: true }
      });

      if (positions.length === 0) {
        return { success: true, updated: 0 };
      }

      // Get unique tickers
      const tickers = [...new Set(positions.map(p => p.ticker))];
      
      // Fetch cached stock data for all tickers (this will use cache or fetch fresh)
      const stockDataResults = await stockCache.getMultipleStockData(tickers);
      
      // Update positions with new prices
      let updatedCount = 0;
      const updatePromises = stockDataResults.map(async (stockData) => {
        // Update all positions with this ticker
        const updateResult = await ctx.db.position.updateMany({
          where: { 
            portfolioId: input.portfolioId,
            ticker: stockData.symbol
          },
          data: {
            currentPrice: stockData.price,
            dividendYield: stockData.dividendYield,
            updatedAt: new Date()
          }
        });
        
        updatedCount += updateResult.count;
      });

      await Promise.all(updatePromises);

      return { 
        success: true, 
        updated: updatedCount,
        totalPositions: positions.length,
        tickersProcessed: tickers.length,
        cachedData: stockDataResults.length
      };
    }),

  // Force refresh a specific stock (bypass cache)
  forceRefreshStock: protectedProcedure
    .input(z.object({ symbol: z.string().toUpperCase() }))
    .mutation(async ({ input }) => {
      const data = await stockCache.refreshStockData(input.symbol);
      return data;
    }),

  // Get cache statistics
  getCacheStats: protectedProcedure
    .query(async () => {
      return stockCache.getCacheStats();
    }),

  // Clean up old cache entries
  cleanupCache: protectedProcedure
    .mutation(async () => {
      return stockCache.cleanupOldCache();
    }),

  // Get historical dividend data for timeline charts
  getHistoricalDividendData: protectedProcedure
    .input(z.object({
      symbol: z.string(),
      fromDate: z.string(),
      toDate: z.string(),
    }))
    .query(async ({ input }) => {
      const { stockAPI } = await import("~/lib/stock-api");
      
      return stockAPI.getHistoricalDividendData(input.symbol, input.fromDate, input.toDate);
    }),
});
