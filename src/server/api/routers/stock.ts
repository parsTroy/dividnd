import { z } from "zod";
import { stockAPI } from "~/lib/stock-api";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  // Get real-time stock data for a single symbol
  getStockData: publicProcedure
    .input(z.object({ symbol: z.string().toUpperCase() }))
    .query(async ({ input }) => {
      const data = await stockAPI.getStockData(input.symbol);
      return data;
    }),

  // Get real-time stock data for multiple symbols
  getMultipleStockData: publicProcedure
    .input(z.object({ symbols: z.array(z.string().toUpperCase()) }))
    .query(async ({ input }) => {
      const promises = input.symbols.map(symbol => 
        stockAPI.getStockData(symbol).then(data => ({ symbol, data }))
      );
      
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<{ symbol: string; data: any }> => 
          result.status === 'fulfilled' && result.value.data !== null
        )
        .map(result => result.value);
    }),

  // Get dividend data for a symbol
  getDividendData: publicProcedure
    .input(z.object({ symbol: z.string().toUpperCase() }))
    .query(async ({ input }) => {
      const data = await stockAPI.getDividendData(input.symbol);
      return data;
    }),

  // Get rate limit status for all APIs
  getRateLimitStatus: protectedProcedure
    .query(() => {
      return stockAPI.getRateLimitStatus();
    }),

  // Refresh stock prices for a portfolio (protected)
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
      
      // Fetch stock data for all tickers
      const stockDataPromises = tickers.map(ticker => 
        stockAPI.getStockData(ticker).then(data => ({ ticker, data }))
      );
      
      const stockDataResults = await Promise.allSettled(stockDataPromises);
      
      // Update positions with new prices
      let updatedCount = 0;
      const updatePromises = stockDataResults
        .filter((result): result is PromiseFulfilledResult<{ ticker: string; data: any }> => 
          result.status === 'fulfilled' && result.value.data !== null
        )
        .map(async ({ value }) => {
          const { ticker, data } = value;
          
          // Update all positions with this ticker
          const updateResult = await ctx.db.position.updateMany({
            where: { 
              portfolioId: input.portfolioId,
              ticker: ticker
            },
            data: {
              currentPrice: data.price,
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
        tickersProcessed: tickers.length
      };
    }),
});
