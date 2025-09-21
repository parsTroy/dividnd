"use client";

import React, { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { api } from "~/trpc/react";

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
  portfolioId: string;
  monthlyDividendGoal?: number | null;
  annualDividendGoal?: number | null;
}

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatPercentage = (value: number) => `${value.toFixed(2)}%`;


export function PortfolioAnalytics({
  positions,
  totalInvested,
  currentValue,
  unrealizedPnL,
  annualDividends,
  portfolioId,
  monthlyDividendGoal,
  annualDividendGoal,
}: PortfolioAnalyticsProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(monthlyDividendGoal || 0);

  // Sync local state with props when they change
  React.useEffect(() => {
    setMonthlyGoal(monthlyDividendGoal || 0);
  }, [monthlyDividendGoal]);

  const utils = api.useUtils();
  const updateGoals = api.portfolio.updateMonthlyDividendGoal.useMutation({
    onSuccess: () => {
      // Invalidate all portfolio-related queries to ensure UI updates
      utils.portfolio.getAll.invalidate();
      utils.position.getPortfolioSummary.invalidate({ portfolioId });
      setShowGoalModal(false);
    },
    onError: (error) => {
      console.error('Failed to update goals:', error);
      // Reset local state on error
      setMonthlyGoal(monthlyDividendGoal || 0);
    },
  });

  const handleSaveGoals = () => {
    updateGoals.mutate({
      id: portfolioId,
      monthlyDividendGoal: monthlyGoal || undefined,
    });
  };

  // Calculate portfolio allocation data
  const allocationData = positions.map((position, index) => ({
    id: position.ticker,
    label: position.ticker,
    value: position.shares * position.currentPrice,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  })).filter(data => data.value > 0);

  // Calculate performance data
  const performanceData = positions.map(position => {
    const costBasis = position.shares * position.purchasePrice;
    const marketValue = position.shares * position.currentPrice;
    const pnl = marketValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return {
      ticker: position.ticker,
      pnl: pnl,
      pnlPercent: pnlPercent,
    };
  });

  // Calculate dividend income over time (monthly projections)
  const currentMonth = new Date().getMonth();
  const monthlyDividendIncome = annualDividends / 12;
  
  // For now, use simple monthly projections
  // TODO: Implement real historical dividend data fetching
  const dividendTimelineData = Array.from({ length: 12 }, (_, i) => {
    const month = (currentMonth + i) % 12;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: monthNames[month] as string,
      actual: monthlyDividendIncome,
      goal: monthlyDividendGoal || 0,
    };
  });

  const totalGainLossPercent = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;
  const portfolioDividendYield = currentValue > 0 ? (annualDividends / currentValue) * 100 : 0;

  // Calculate goal progress
  const monthlyProgress = monthlyDividendGoal ? (monthlyDividendIncome / monthlyDividendGoal) * 100 : 0;
  const annualProgress = annualDividendGoal ? (annualDividends / annualDividendGoal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Portfolio Value */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-700">Total Portfolio Value</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentValue)}</div>
              <div className="text-sm text-blue-600">current market value</div>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Total Return */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-700">Total Return</div>
              <div className={`text-2xl font-bold ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(unrealizedPnL)}
              </div>
              <div className={`text-sm ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(totalGainLossPercent)}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unrealizedPnL >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
              <svg className={`w-6 h-6 ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Annual Dividend Income */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-700">Annual Dividend Income</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(annualDividends)}
              </div>
              <div className="text-sm text-orange-600">projected yearly</div>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Portfolio Yield */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-700">Portfolio Yield</div>
              <div className="text-2xl font-bold text-purple-600">{formatPercentage(portfolioDividendYield)}</div>
              <div className="text-sm text-purple-600">dividend yield</div>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      {/* Future Value Calculator CTA - Full Width */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Future Value Calculator</h3>
              <p className="text-sm text-gray-600">Calculate your portfolio's future value with compound growth</p>
            </div>
          </div>
          <a 
            href="/calculator" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Open Calculator
          </a>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Portfolio Allocation Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
          <div className="h-80">
            <ResponsivePie
              data={allocationData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              arcLabel={(d) => formatCurrency(d.value)}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                { match: { id: 'ruby' }, id: 'dots' },
                { match: { id: 'c' }, id: 'dots' },
                { match: { id: 'go' }, id: 'lines' },
                { match: { id: 'python' }, id: 'lines' }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle'
                }
              ]}
            />
          </div>
        </div>

        {/* Position Performance Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Performance</h3>
          <div className="h-96">
            <ResponsiveBar
              data={performanceData}
              keys={['pnl']}
              indexBy="ticker"
              margin={{ top: 50, right: 80, bottom: 50, left: 100 }}
              padding={0.4}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                {
                  match: { id: 'fries' },
                  id: 'lines'
                },
                {
                  match: { id: 'sandwich' },
                  id: 'lines'
                }
              ]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Ticker',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 8,
                tickRotation: 0,
                legend: 'P&L ($)',
                legendPosition: 'middle',
                legendOffset: -50,
                format: (value) => formatCurrency(value)
              }}
              labelSkipWidth={16}
              labelSkipHeight={16}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              label={(d) => formatCurrency(d.value ?? 0)}
              animate={true}
            />
          </div>
        </div>
      </div>

      {/* Dividend Income Timeline - Full Width */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Anticipated Dividend Income Timeline</h3>
        <div className="h-80">
          <ResponsiveLine
            data={[
              {
                id: 'Actual Income',
                data: dividendTimelineData.map(d => ({ x: d.month, y: d.actual })),
                color: '#3B82F6'
              },
              {
                id: 'Goal',
                data: dividendTimelineData.map(d => ({ x: d.month, y: d.goal })),
                color: '#10B981'
              }
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            yFormat={(value) => formatCurrency(Number(value))}
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Monthly Income ($)',
              legendOffset: -40,
              legendPosition: 'middle',
              format: (value) => formatCurrency(Number(value))
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            colors={{ scheme: 'nivo' }}
            lineWidth={3}
            enableSlices="x"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Compact Goal Setting Section */}
      <div data-goal-section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Dividend Income Goals</h3>
          <button
            onClick={() => setShowGoalModal(true)}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Set Goals
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-sm font-medium text-gray-700">Monthly Goal</div>
              <div className="text-lg font-semibold text-indigo-700">
                {monthlyDividendGoal ? formatCurrency(monthlyDividendGoal) : 'Not set'}
              </div>
            </div>
            
            {monthlyDividendGoal && (
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {monthlyProgress.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          {monthlyDividendGoal && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">Annual Equivalent</div>
              <div className="text-lg font-semibold text-indigo-700">
                {formatCurrency(monthlyDividendGoal * 12)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 backdrop-blur-sm" onClick={() => setShowGoalModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Set Dividend Goals</h2>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Dividend Goal ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 1000"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Annual equivalent: {monthlyGoal ? formatCurrency(monthlyGoal * 12) : '$0.00'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoals}
                  disabled={updateGoals.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updateGoals.isPending ? 'Saving...' : 'Save Goals'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}