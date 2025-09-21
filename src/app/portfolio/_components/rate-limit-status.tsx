"use client";

import { api } from "~/trpc/react";

export function RateLimitStatus() {
  const { data: rateLimits, isLoading } = api.stock.getRateLimitStatus.useQuery();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-600">Loading API status...</div>
      </div>
    );
  }

  if (!rateLimits) {
    return null;
  }

  const getStatusColor = (requests: number, limit: number) => {
    const percentage = (requests / limit) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusText = (requests: number, limit: number) => {
    const percentage = (requests / limit) * 100;
    if (percentage >= 90) return "Critical";
    if (percentage >= 70) return "High";
    return "Good";
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">API Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alpha Vantage */}
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Alpha Vantage</div>
          <div className={`text-sm font-medium ${getStatusColor(rateLimits.alphaVantage.requests, rateLimits.alphaVantage.limit)}`}>
            {rateLimits.alphaVantage.requests} / {rateLimits.alphaVantage.limit}
          </div>
          <div className="text-xs text-gray-500">
            {getStatusText(rateLimits.alphaVantage.requests, rateLimits.alphaVantage.limit)}
          </div>
          <div className="text-xs text-gray-400">
            Resets: {rateLimits.alphaVantage.resetTime.toLocaleDateString()}
          </div>
        </div>

        {/* Finnhub */}
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Finnhub</div>
          <div className={`text-sm font-medium ${getStatusColor(rateLimits.finnhub.requests, rateLimits.finnhub.limit)}`}>
            {rateLimits.finnhub.requests} / {rateLimits.finnhub.limit}
          </div>
          <div className="text-xs text-gray-500">
            {getStatusText(rateLimits.finnhub.requests, rateLimits.finnhub.limit)}
          </div>
          <div className="text-xs text-gray-400">
            Resets: {rateLimits.finnhub.resetTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
