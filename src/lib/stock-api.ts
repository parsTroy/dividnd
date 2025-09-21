// Stock API service with fallback logic
// Supports Alpha Vantage and Finnhub

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  dividendYield?: number;
  lastUpdated: Date;
  source: 'alpha_vantage' | 'finnhub';
}

export interface DividendData {
  symbol: string;
  dividend: number;
  exDate: string;
  recordDate: string;
  paymentDate: string;
  source: 'alpha_vantage' | 'finnhub';
}

class StockAPIService {
  private alphaVantageKey: string;
  private finnhubKey: string;
  
  // Rate limiting tracking
  private rateLimits = {
    alphaVantage: { requests: 0, resetTime: Date.now() + 24 * 60 * 60 * 1000 }, // 24 hours
    finnhub: { requests: 0, resetTime: Date.now() + 60 * 1000 }, // 1 minute
  };

  constructor() {
    this.alphaVantageKey = process.env.ALPHAVANTAGE_KEY || '';
    this.finnhubKey = process.env.FINNHUB_KEY || '';
  }

  // Check if we can make a request to an API
  private canMakeRequest(api: keyof typeof this.rateLimits): boolean {
    const limit = this.rateLimits[api];
    const now = Date.now();
    
    if (now > limit.resetTime) {
      // Reset the counter
      limit.requests = 0;
      limit.resetTime = now + (api === 'finnhub' ? 60 * 1000 : 24 * 60 * 60 * 1000);
    }

    switch (api) {
      case 'alphaVantage':
        return limit.requests < 25; // 25 requests per day
      case 'finnhub':
        return limit.requests < 60; // 60 requests per minute
      default:
        return false;
    }
  }

  // Increment request counter
  private incrementRequest(api: keyof typeof this.rateLimits): void {
    this.rateLimits[api].requests++;
  }

  // Alpha Vantage API calls
  private async fetchFromAlphaVantage(symbol: string): Promise<StockData | null> {
    if (!this.alphaVantageKey || !this.canMakeRequest('alphaVantage')) {
      return null;
    }

    try {
      this.incrementRequest('alphaVantage');
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      
      if (!response.ok) throw new Error('Alpha Vantage API error');
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }

      const quote = data['Global Quote'];
      if (!quote || !quote['05. price']) {
        throw new Error('No data available');
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        lastUpdated: new Date(),
        source: 'alpha_vantage'
      };
    } catch (error) {
      console.error('Alpha Vantage error:', error);
      return null;
    }
  }


  // Finnhub API calls
  private async fetchFromFinnhub(symbol: string): Promise<StockData | null> {
    if (!this.finnhubKey || !this.canMakeRequest('finnhub')) {
      return null;
    }

    try {
      this.incrementRequest('finnhub');
      
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.finnhubKey}`
      );
      
      if (!response.ok) throw new Error('Finnhub API error');
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        symbol: symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        lastUpdated: new Date(),
        source: 'finnhub'
      };
    } catch (error) {
      console.error('Finnhub error:', error);
      return null;
    }
  }

  // Main method with fallback logic
  async getStockData(symbol: string): Promise<StockData | null> {
    const apis = [
      () => this.fetchFromAlphaVantage(symbol),
      () => this.fetchFromFinnhub(symbol)
    ];

    for (const apiCall of apis) {
      try {
        const result = await apiCall();
        if (result) {
          console.log(`Stock data fetched from ${result.source} for ${symbol}`);
          return result;
        }
      } catch (error) {
        console.error('API call failed, trying next provider:', error);
        continue;
      }
    }

    console.error(`All APIs failed for symbol: ${symbol}`);
    return null;
  }

  // Get dividend data (primarily from Alpha Vantage)
  async getDividendData(symbol: string): Promise<DividendData | null> {
    if (!this.alphaVantageKey || !this.canMakeRequest('alphaVantage')) {
      return null;
    }

    try {
      this.incrementRequest('alphaVantage');
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      
      if (!response.ok) throw new Error('Alpha Vantage API error');
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }

      if (!data.DividendYield) {
        return null;
      }

      return {
        symbol: data.Symbol,
        dividend: parseFloat(data.DividendPerShare || '0'),
        exDate: data.ExDividendDate || '',
        recordDate: data.RecordDate || '',
        paymentDate: data.PaymentDate || '',
        source: 'alpha_vantage'
      };
    } catch (error) {
      console.error('Dividend data error:', error);
      return null;
    }
  }

  // Get rate limit status
  getRateLimitStatus() {
    return {
      alphaVantage: {
        requests: this.rateLimits.alphaVantage.requests,
        limit: 25,
        resetTime: new Date(this.rateLimits.alphaVantage.resetTime)
      },
      finnhub: {
        requests: this.rateLimits.finnhub.requests,
        limit: 60,
        resetTime: new Date(this.rateLimits.finnhub.resetTime)
      }
    };
  }
}

// Export singleton instance
export const stockAPI = new StockAPIService();
