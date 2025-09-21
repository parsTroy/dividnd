// Stock data caching service
// Handles smart caching to avoid redundant API calls and respect rate limits

import { stockAPI, type StockData, type DividendData } from "./stock-api";
import { db } from "~/server/db";

export interface CachedStockData {
  id: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  dividendYield?: number;
  lastUpdated: Date;
  source: 'alpha_vantage' | 'finnhub';
  createdAt: Date;
  updatedAt: Date;
}

export interface CachedDividendData {
  id: string;
  symbol: string;
  dividend: number;
  exDate: string;
  recordDate: string;
  paymentDate: string;
  source: 'alpha_vantage' | 'finnhub';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

class StockCacheService {
  // Cache duration: 24 hours for free tier, 1 hour for production
  private readonly CACHE_DURATION_MS = process.env.NODE_ENV === 'production' 
    ? 60 * 60 * 1000 // 1 hour in production
    : 24 * 60 * 60 * 1000; // 24 hours in development

  // Check if cached data is still valid
  private isCacheValid(lastUpdated: Date): boolean {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    return diffMs < this.CACHE_DURATION_MS;
  }

  // Get cached stock data or fetch from API
  async getStockData(symbol: string): Promise<CachedStockData | null> {
    try {
      // First, check if we have valid cached data
      const cachedData = await db.stockData.findFirst({
        where: { symbol: symbol.toUpperCase() }
      });

      if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
        return {
          id: cachedData.id,
          symbol: cachedData.symbol,
          price: cachedData.price,
          change: cachedData.change,
          changePercent: cachedData.changePercent,
          dividendYield: cachedData.dividendYield ?? undefined,
          lastUpdated: cachedData.lastUpdated,
          source: cachedData.source as 'alpha_vantage' | 'finnhub',
          createdAt: cachedData.createdAt,
          updatedAt: cachedData.updatedAt
        };
      }

      // Cache is invalid or doesn't exist, fetch from API
      const freshData = await stockAPI.getStockData(symbol);
      
      if (!freshData) {
        return null;
      }

      // Save to database (upsert)
      const savedData = await db.stockData.upsert({
        where: { symbol: symbol.toUpperCase() },
        update: {
          price: freshData.price,
          change: freshData.change,
          changePercent: freshData.changePercent,
          dividendYield: freshData.dividendYield,
          lastUpdated: freshData.lastUpdated,
          source: freshData.source,
          updatedAt: new Date()
        },
        create: {
          symbol: symbol.toUpperCase(),
          price: freshData.price,
          change: freshData.change,
          changePercent: freshData.changePercent,
          dividendYield: freshData.dividendYield,
          lastUpdated: freshData.lastUpdated,
          source: freshData.source
        }
      });

      return {
        id: savedData.id,
        symbol: savedData.symbol,
        price: savedData.price,
        change: savedData.change,
        changePercent: savedData.changePercent,
        dividendYield: savedData.dividendYield ?? undefined,
        lastUpdated: savedData.lastUpdated,
        source: savedData.source as 'alpha_vantage' | 'finnhub',
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt
      };

    } catch (error) {
      console.error(`Error in getStockData for ${symbol}:`, error);
      return null;
    }
  }

  // Get cached dividend data or fetch from API
  async getDividendData(symbol: string): Promise<CachedDividendData | null> {
    try {
      // First, check if we have valid cached data
      const cachedData = await db.dividendData.findFirst({
        where: { symbol: symbol.toUpperCase() }
      });

      if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
        return {
          id: cachedData.id,
          symbol: cachedData.symbol,
          dividend: cachedData.dividend,
          exDate: cachedData.exDate,
          recordDate: cachedData.recordDate,
          paymentDate: cachedData.paymentDate,
          source: cachedData.source as 'alpha_vantage' | 'finnhub',
          lastUpdated: cachedData.lastUpdated,
          createdAt: cachedData.createdAt,
          updatedAt: cachedData.updatedAt
        };
      }

      // Cache is invalid or doesn't exist, fetch from API
      const freshData = await stockAPI.getDividendData(symbol);
      
      if (!freshData) {
        return null;
      }

      // Save to database (upsert)
      const now = new Date();
      const savedData = await db.dividendData.upsert({
        where: { symbol: symbol.toUpperCase() },
        update: {
          dividend: freshData.dividend,
          exDate: freshData.exDate,
          recordDate: freshData.recordDate,
          paymentDate: freshData.paymentDate,
          lastUpdated: now,
          source: freshData.source,
          updatedAt: now
        },
        create: {
          symbol: symbol.toUpperCase(),
          dividend: freshData.dividend,
          exDate: freshData.exDate,
          recordDate: freshData.recordDate,
          paymentDate: freshData.paymentDate,
          lastUpdated: now,
          source: freshData.source
        }
      });

      return {
        id: savedData.id,
        symbol: savedData.symbol,
        dividend: savedData.dividend,
        exDate: savedData.exDate,
        recordDate: savedData.recordDate,
        paymentDate: savedData.paymentDate,
        source: savedData.source as 'alpha_vantage' | 'finnhub',
        lastUpdated: savedData.lastUpdated,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt
      };

    } catch (error) {
      console.error(`Error in getDividendData for ${symbol}:`, error);
      return null;
    }
  }

  // Get multiple stock data efficiently
  async getMultipleStockData(symbols: string[]): Promise<CachedStockData[]> {
    const results: CachedStockData[] = [];
    
    for (const symbol of symbols) {
      const data = await this.getStockData(symbol);
      if (data) {
        results.push(data);
      }
    }
    
    return results;
  }

  // Force refresh data for a symbol (bypass cache)
  async refreshStockData(symbol: string): Promise<CachedStockData | null> {
    console.log(`Force refreshing data for ${symbol}`);
    
    // Delete existing cache
    await db.stockData.deleteMany({
      where: { symbol: symbol.toUpperCase() }
    });
    
    // Fetch fresh data
    return this.getStockData(symbol);
  }

  // Get cache statistics
  async getCacheStats() {
    const totalStocks = await db.stockData.count();
    const totalDividends = await db.dividendData.count();
    
    const recentStocks = await db.stockData.findMany({
      where: {
        lastUpdated: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: { symbol: true, lastUpdated: true, source: true }
    });

    return {
      totalStocks,
      totalDividends,
      recentUpdates: recentStocks.length,
      recentStocks: recentStocks.map(s => ({
        symbol: s.symbol,
        lastUpdated: s.lastUpdated,
        source: s.source
      }))
    };
  }

  // Clean up old cache entries (optional maintenance)
  async cleanupOldCache() {
    const cutoffDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago
    
    const deletedStocks = await db.stockData.deleteMany({
      where: {
        lastUpdated: {
          lt: cutoffDate
        }
      }
    });

    const deletedDividends = await db.dividendData.deleteMany({
      where: {
        lastUpdated: {
          lt: cutoffDate
        }
      }
    });

    return {
      deletedStocks: deletedStocks.count,
      deletedDividends: deletedDividends.count
    };
  }
}

// Export singleton instance
export const stockCache = new StockCacheService();
