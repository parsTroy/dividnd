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
  private async fetchCompanyOverview(symbol: string): Promise<any | null> {
    if (!this.alphaVantageKey || !this.canMakeRequest('alphaVantage')) {
      return null;
    }

    try {
      this.incrementRequest('alphaVantage');
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      
      if (!response.ok) throw new Error('Alpha Vantage company overview API error');
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }

      return data;
    } catch (error) {
      console.error('Alpha Vantage company overview error:', error);
      return null;
    }
  }

  private async fetchFromAlphaVantage(symbol: string): Promise<StockData | null> {
    if (!this.alphaVantageKey || !this.canMakeRequest('alphaVantage')) {
      return null;
    }

    try {
      this.incrementRequest('alphaVantage');
      
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`;
      const response = await fetch(url);
      
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
        source: 'alpha_vantage' as const
      };
    } catch (error) {
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
    // Try Alpha Vantage first (has both stock and dividend data)
    const alphaVantageResult = await this.fetchFromAlphaVantage(symbol);
    if (alphaVantageResult) {
      // Try to get dividend yield from Alpha Vantage company overview
      const companyOverview = await this.fetchCompanyOverview(symbol);
      if (companyOverview && companyOverview.DividendYield) {
        const dividendYield = parseFloat(companyOverview.DividendYield);
        if (dividendYield > 0) {
          // Alpha Vantage returns dividend yield as decimal (0.073), convert to percentage (7.3)
          alphaVantageResult.dividendYield = dividendYield * 100;
        }
      }
      return alphaVantageResult;
    }

    // Fallback to Finnhub
    const finnhubResult = await this.fetchFromFinnhub(symbol);
    if (finnhubResult) {
      return finnhubResult;
    }

    return null;
  }

  // Get company profile data (includes dividend yield, P/E ratio, etc.)
  private async fetchCompanyProfile(symbol: string): Promise<any | null> {
    if (!this.finnhubKey || !this.canMakeRequest('finnhub')) {
      return null;
    }

    try {
      this.incrementRequest('finnhub');
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.finnhubKey}`
      );
      
      if (!response.ok) throw new Error('Finnhub company profile API error');
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Finnhub company profile error:', error);
      return null;
    }
  }

  // Get company financials data (includes dividend yield, P/E ratio, etc.)
  private async fetchCompanyFinancials(symbol: string): Promise<any | null> {
    if (!this.finnhubKey || !this.canMakeRequest('finnhub')) {
      return null;
    }

    try {
      this.incrementRequest('finnhub');
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${this.finnhubKey}`
      );
      
      if (!response.ok) throw new Error('Finnhub financials API error');
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Finnhub financials error:', error);
      return null;
    }
  }

  // Get dividend data (primarily from Alpha Vantage)
  async getDividendData(symbol: string): Promise<DividendData | null> {
    // Try Alpha Vantage first (has comprehensive dividend data)
    if (this.alphaVantageKey && this.canMakeRequest('alphaVantage')) {
      try {
        this.incrementRequest('alphaVantage');
        
        const response = await fetch(
          `https://www.alphavantage.co/query?function=DIVIDENDS&symbol=${symbol}&apikey=${this.alphaVantageKey}`
        );
        
        if (!response.ok) throw new Error('Alpha Vantage dividends API error');
        
        const data = await response.json();
        
        if (data['Error Message'] || data['Note']) {
          throw new Error(data['Error Message'] || data['Note']);
        }

        if (data['Monthly Adjusted Time Series']) {
          // Get the most recent dividend from the time series
          const timeSeries = data['Monthly Adjusted Time Series'] as Record<string, any>;
          const dates = Object.keys(timeSeries).sort().reverse();
          
          if (dates.length > 0) {
            const latestDate = dates[0];
            const latestData = latestDate ? timeSeries[latestDate] : null;
            
            return {
              symbol: symbol,
              dividend: parseFloat(latestData?.['7. dividend amount'] || '0'),
              exDate: latestDate || '',
              recordDate: '',
              paymentDate: latestDate || '',
              source: 'alpha_vantage'
            };
          }
        }

        // Fallback to company overview for basic dividend data
        const overview = await this.fetchCompanyOverview(symbol);
        if (overview && overview.DividendPerShare) {
          return {
            symbol: overview.Symbol,
            dividend: parseFloat(overview.DividendPerShare || '0'),
            exDate: overview.ExDividendDate || '',
            recordDate: overview.RecordDate || '',
            paymentDate: overview.PaymentDate || '',
            source: 'alpha_vantage'
          };
        }
      } catch (error) {
        console.error('Alpha Vantage dividend data error:', error);
      }
    }

    // Fallback to Finnhub
    if (this.finnhubKey && this.canMakeRequest('finnhub')) {
      try {
        this.incrementRequest('finnhub');
        
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/dividend?symbol=${symbol}&token=${this.finnhubKey}`
        );
        
        if (!response.ok) throw new Error('Finnhub API error');
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Get the most recent dividend
          const latestDividend = data[0];
          return {
            symbol: symbol,
            dividend: latestDividend.amount || 0,
            exDate: latestDividend.exDate || '',
            recordDate: latestDividend.recordDate || '',
            paymentDate: latestDividend.payDate || '',
            source: 'finnhub'
          };
        }
      } catch (error) {
        console.error('Finnhub dividend data error:', error);
      }
    }

    return null;
  }

  // Get historical dividend data for timeline charts
  async getHistoricalDividendData(symbol: string, fromDate: string, toDate: string): Promise<any[]> {
    // Try Alpha Vantage first (has comprehensive historical dividend data)
    if (this.alphaVantageKey && this.canMakeRequest('alphaVantage')) {
      try {
        this.incrementRequest('alphaVantage');
        
        const response = await fetch(
          `https://www.alphavantage.co/query?function=DIVIDENDS&symbol=${symbol}&apikey=${this.alphaVantageKey}`
        );
        
        if (!response.ok) throw new Error('Alpha Vantage historical dividend API error');
        
        const data = await response.json();
        
        if (data['Error Message'] || data['Note']) {
          throw new Error(data['Error Message'] || data['Note']);
        }

        if (data['Monthly Adjusted Time Series']) {
          const timeSeries = data['Monthly Adjusted Time Series'];
          const dividends = [];
          
          for (const [date, values] of Object.entries(timeSeries)) {
            const dividendAmount = parseFloat((values as any)['7. dividend amount'] || '0');
            if (dividendAmount > 0) {
              dividends.push({
                date: date,
                amount: dividendAmount,
                exDate: date,
                paymentDate: date
              });
            }
          }
          
          // Sort by date and filter by date range
          return dividends
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .filter(d => {
              const dividendDate = new Date(d.date);
              const from = new Date(fromDate);
              const to = new Date(toDate);
              return dividendDate >= from && dividendDate <= to;
            });
        }
      } catch (error) {
        console.error('Alpha Vantage historical dividend error:', error);
      }
    }

    // Fallback to Finnhub
    if (this.finnhubKey && this.canMakeRequest('finnhub')) {
      try {
        this.incrementRequest('finnhub');
        
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/dividend?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${this.finnhubKey}`
        );
        
        if (!response.ok) throw new Error('Finnhub historical dividend API error');
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        return data || [];
      } catch (error) {
        console.error('Finnhub historical dividend error:', error);
      }
    }

    return [];
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
