"use client";

import React, { useState, useEffect } from 'react';
import { api } from "~/trpc/react";

interface StockSuggestion {
  ticker: string;
  name: string;
  currentPrice: number;
  dividendYield: number;
  annualDividend: number;
  sharesNeeded: number;
  investmentNeeded: number;
  monthlyIncome: number;
}

interface StockSuggestionsProps {
  portfolioId: string;
  monthlyDividendGoal: number | null;
  currentPositions: Array<{ ticker: string }>;
}

export function StockSuggestions({ portfolioId, monthlyDividendGoal, currentPositions }: StockSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all cached stock data
  const { data: cachedStocks } = api.stock.getAllCachedStocks.useQuery();

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Generate stock suggestions based on cached data
  const generateSuggestions = async () => {
    if (!monthlyDividendGoal || monthlyDividendGoal <= 0) {
      setError("Please set a monthly dividend goal to get stock suggestions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use cached stock data from the query
      if (!cachedStocks || cachedStocks.length === 0) {
        setError("No stock data available. Please add some stocks to your portfolio to build up our database.");
        return;
      }

      // Filter for high dividend yield stocks (>= 3%)
      const highYieldStocks = cachedStocks
        .filter(stock => 
          stock.dividendYield && 
          stock.dividendYield >= 3 && 
          stock.currentPrice && 
          stock.currentPrice > 0
        )
        .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        .slice(0, 10); // Top 10 high yield stocks

      // Filter out stocks already in portfolio
      const currentTickers = currentPositions.map(pos => pos.ticker.toUpperCase());
      const availableStocks = highYieldStocks.filter(
        stock => !currentTickers.includes(stock.ticker.toUpperCase())
      );

      // Calculate suggestions
      const monthlyGoal = monthlyDividendGoal;
      const suggestions: StockSuggestion[] = availableStocks.map(stock => {
        const annualDividend = (stock.currentPrice || 0) * (stock.dividendYield || 0) / 100;
        const monthlyDividend = annualDividend / 12;
        const sharesNeeded = Math.ceil(monthlyGoal / monthlyDividend);
        const investmentNeeded = sharesNeeded * (stock.currentPrice || 0);
        const actualMonthlyIncome = sharesNeeded * monthlyDividend;

        return {
          ticker: stock.ticker,
          name: stock.ticker, // We don't have company names in cached data
          currentPrice: stock.currentPrice || 0,
          dividendYield: stock.dividendYield || 0,
          annualDividend,
          sharesNeeded,
          investmentNeeded,
          monthlyIncome: actualMonthlyIncome
        };
      });

      // Sort by investment efficiency (lowest investment for target income)
      suggestions.sort((a, b) => a.investmentNeeded - b.investmentNeeded);

      setSuggestions(suggestions.slice(0, 5)); // Top 5 suggestions
    } catch (err) {
      setError("Failed to generate stock suggestions. Please try again.");
      console.error("Error generating suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate suggestions when component mounts or goal changes
  useEffect(() => {
    if (monthlyDividendGoal && monthlyDividendGoal > 0) {
      generateSuggestions();
    }
  }, [monthlyDividendGoal, currentPositions.length]);

  if (!monthlyDividendGoal || monthlyDividendGoal <= 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stock Suggestions</h3>
            <p className="text-sm text-gray-600">Set a monthly dividend goal to get personalized stock recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stock Suggestions</h3>
            <p className="text-sm text-gray-600">
              High dividend yield stocks to help achieve your ${formatCurrency(monthlyDividendGoal)}/month goal
            </p>
          </div>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Analyzing stock data...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.ticker} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{suggestion.ticker}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {formatPercentage(suggestion.dividendYield)} yield
                    </span>
                    <span className="text-sm text-gray-500">
                      ${formatCurrency(suggestion.currentPrice)}/share
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Shares needed:</span>
                      <div className="font-semibold text-gray-900">{suggestion.sharesNeeded.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Investment:</span>
                      <div className="font-semibold text-gray-900">{formatCurrency(suggestion.investmentNeeded)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly income:</span>
                      <div className="font-semibold text-green-600">{formatCurrency(suggestion.monthlyIncome)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Annual income:</span>
                      <div className="font-semibold text-green-600">{formatCurrency(suggestion.monthlyIncome * 12)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Add to Portfolio
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These suggestions are based on our cached stock data. 
              More suggestions become available as we build up our database of stock information.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No stock suggestions available at the moment.</p>
          <p className="text-sm">Try adding more stocks to your portfolio to build up our database.</p>
        </div>
      )}
    </div>
  );
}
