"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface Position {
  id: string;
  ticker: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  dividendYield?: number;
  purchaseDate: Date;
}

interface PortfolioAnalyticsProps {
  positions: Position[];
  totalInvested: number;
  currentValue: number;
  unrealizedPnL: number;
  annualDividends: number;
}

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
];

export function PortfolioAnalytics({
  positions,
  totalInvested,
  currentValue,
  unrealizedPnL,
  annualDividends,
}: PortfolioAnalyticsProps) {
  // Calculate portfolio allocation data
  const allocationData = positions.map((position, index) => ({
    name: position.ticker,
    value: position.shares * position.currentPrice,
    color: COLORS[index % COLORS.length],
    percentage: ((position.shares * position.currentPrice) / currentValue) * 100,
  }));

  // Calculate performance data (simplified - in real app, you'd want historical data)
  const performanceData = positions.map((position) => {
    const marketValue = position.shares * position.currentPrice;
    const costBasis = position.shares * position.purchasePrice;
    const gainLoss = marketValue - costBasis;
    const gainLossPercent = (gainLoss / costBasis) * 100;

    return {
      ticker: position.ticker,
      marketValue,
      costBasis,
      gainLoss,
      gainLossPercent,
      shares: position.shares,
    };
  });

  // Calculate dividend yield data
  const dividendData = positions
    .filter((position) => position.dividendYield && position.dividendYield > 0)
    .map((position) => ({
      ticker: position.ticker,
      yield: position.dividendYield || 0,
      annualDividend: (position.shares * position.currentPrice * (position.dividendYield || 0)) / 100,
    }))
    .sort((a, b) => b.yield - a.yield);

  // Calculate portfolio metrics
  const totalGainLoss = unrealizedPnL;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  const portfolioDividendYield = currentValue > 0 ? (annualDividends / currentValue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Return</div>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
          </div>
          <div className={`text-sm ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Portfolio Yield</div>
          <div className="text-2xl font-bold text-blue-600">
            {portfolioDividendYield.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">
            ${annualDividends.toLocaleString()}/year
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Positions</div>
          <div className="text-2xl font-bold text-gray-900">
            {positions.length}
          </div>
          <div className="text-sm text-gray-600">
            {positions.length === 1 ? 'position' : 'positions'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Avg. Position Size</div>
          <div className="text-2xl font-bold text-gray-900">
            ${(currentValue / positions.length).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            per position
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${(percentage as number).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ticker" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'gainLoss' ? `$${Number(value).toLocaleString()}` : `${Number(value).toFixed(2)}%`,
                    name === 'gainLoss' ? 'Gain/Loss' : 'Return %'
                  ]}
                />
                <Bar dataKey="gainLossPercent" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dividend Yield Chart */}
        {dividendData.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dividend Yields</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dividendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ticker" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)}%`,
                      'Dividend Yield'
                    ]}
                  />
                  <Bar dataKey="yield" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Portfolio Value Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Invested</span>
              <span className="font-semibold">${totalInvested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Value</span>
              <span className="font-semibold">${currentValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unrealized P&L</span>
              <span className={`font-semibold ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Annual Dividends</span>
              <span className="font-semibold text-blue-600">${annualDividends.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Return %</span>
                <span className={`font-semibold ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Position Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Basis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dividend Yield
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData
                .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                .map((position) => (
                  <tr key={position.ticker}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {position.ticker}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${position.costBasis.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${position.marketValue.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      position.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.gainLossPercent >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {positions.find(p => p.ticker === position.ticker)?.dividendYield?.toFixed(2) || 'N/A'}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
