"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from "~/trpc/react";

export default function CalculatorPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    currentValue: '',
    expectedReturn: 8, // Default 8% annual return
    timeFrame: 10, // Default 10 years
    monthlyDeposit: '',
    weeklyDeposit: '',
    depositFrequency: 'monthly' as 'monthly' | 'weekly'
  });
  const [results, setResults] = useState<{
    futureValue: number;
    totalInvested: number;
    totalGains: number;
    monthlyBreakdown: Array<{
      month: number;
      value: number;
      invested: number;
      gains: number;
    }>;
  } | null>(null);

  // Get user's portfolios for current value selection
  const { data: portfolios } = api.portfolio.getAll.useQuery(undefined, {
    enabled: !!session
  });

  const calculateFutureValue = () => {
    const currentVal = parseFloat(formData.currentValue) || 0;
    const annualReturn = formData.expectedReturn / 100;
    const years = formData.timeFrame;
    const monthlyDeposit = parseFloat(formData.monthlyDeposit) || 0;
    const weeklyDeposit = parseFloat(formData.weeklyDeposit) || 0;
    
    // Calculate monthly return rate
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
    
    // Calculate total months
    const totalMonths = years * 12;
    
    // Calculate future value using compound interest formula
    // FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
    let futureValue = currentVal * Math.pow(1 + monthlyReturn, totalMonths);
    
    // Add monthly deposits
    if (monthlyDeposit > 0) {
      const futureValueOfAnnuity = monthlyDeposit * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
      futureValue += futureValueOfAnnuity;
    }
    
    // Add weekly deposits (convert to monthly equivalent)
    if (weeklyDeposit > 0) {
      const monthlyEquivalent = weeklyDeposit * 4.33; // Average weeks per month
      const futureValueOfAnnuity = monthlyEquivalent * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
      futureValue += futureValueOfAnnuity;
    }
    
    // Calculate total invested
    const totalInvested = currentVal + (monthlyDeposit * totalMonths) + (weeklyDeposit * 4.33 * totalMonths);
    const totalGains = futureValue - totalInvested;
    
    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let runningValue = currentVal;
    let runningInvested = currentVal;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Apply monthly return
      runningValue = runningValue * (1 + monthlyReturn);
      
      // Add monthly deposit
      if (monthlyDeposit > 0) {
        runningValue += monthlyDeposit;
        runningInvested += monthlyDeposit;
      }
      
      // Add weekly deposits
      if (weeklyDeposit > 0) {
        const weeklyAmount = weeklyDeposit * 4.33;
        runningValue += weeklyAmount;
        runningInvested += weeklyAmount;
      }
      
      monthlyBreakdown.push({
        month,
        value: runningValue,
        invested: runningInvested,
        gains: runningValue - runningInvested
      });
    }
    
    setResults({
      futureValue,
      totalInvested,
      totalGains,
      monthlyBreakdown
    });
  };

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the Future Value Calculator.</p>
          <a 
            href="/api/auth/signin" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Future Value Calculator</h1>
          <p className="text-gray-600 mt-2">
            Calculate how your portfolio will grow over time with compound interest and regular deposits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Calculator Settings</h2>
            
            <div className="space-y-6">
              {/* Current Portfolio Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Portfolio Value ($)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current portfolio value"
                  />
                  {portfolios && portfolios.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const portfolio = portfolios.find(p => p.id === e.target.value);
                          if (portfolio) {
                            // You would need to get the portfolio summary here
                            // For now, just set a placeholder
                            setFormData({ ...formData, currentValue: '10000' });
                          }
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Portfolio</option>
                      {portfolios.map((portfolio) => (
                        <option key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Expected Annual Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.expectedReturn}
                    onChange={(e) => setFormData({ ...formData, expectedReturn: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                    max="50"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Conservative estimate: 6-8%, Moderate: 8-10%, Aggressive: 10-12%
                </p>
              </div>

              {/* Time Frame */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Frame (Years)
                </label>
                <input
                  type="number"
                  value={formData.timeFrame}
                  onChange={(e) => setFormData({ ...formData, timeFrame: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
              </div>

              {/* Deposit Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Deposits
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="depositFrequency"
                        value="monthly"
                        checked={formData.depositFrequency === 'monthly'}
                        onChange={(e) => setFormData({ ...formData, depositFrequency: e.target.value as 'monthly' | 'weekly' })}
                        className="mr-2"
                      />
                      Monthly
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="depositFrequency"
                        value="weekly"
                        checked={formData.depositFrequency === 'weekly'}
                        onChange={(e) => setFormData({ ...formData, depositFrequency: e.target.value as 'monthly' | 'weekly' })}
                        className="mr-2"
                      />
                      Weekly
                    </label>
                  </div>
                  
                  {formData.depositFrequency === 'monthly' ? (
                    <input
                      type="number"
                      value={formData.monthlyDeposit}
                      onChange={(e) => setFormData({ ...formData, monthlyDeposit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Monthly deposit amount ($)"
                      min="0"
                    />
                  ) : (
                    <input
                      type="number"
                      value={formData.weeklyDeposit}
                      onChange={(e) => setFormData({ ...formData, weeklyDeposit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Weekly deposit amount ($)"
                      min="0"
                    />
                  )}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateFutureValue}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Calculate Future Value
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Results</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Future Value</div>
                    <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.futureValue)}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Total Invested</div>
                    <div className="text-2xl font-bold text-green-900">{formatCurrency(results.totalInvested)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Total Gains</div>
                    <div className="text-2xl font-bold text-purple-900">{formatCurrency(results.totalGains)}</div>
                  </div>
                </div>

                {/* Growth Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Over Time</h3>
                  <div className="h-64 bg-gray-50 rounded-lg p-4">
                    <div className="text-center text-gray-500">
                      <p>Chart visualization would go here</p>
                      <p className="text-sm">Showing portfolio growth from {formatCurrency(parseFloat(formData.currentValue) || 0)} to {formatCurrency(results.futureValue)}</p>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Initial Investment</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(formData.currentValue) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Regular Deposits</span>
                    <span className="font-semibold">
                      {formatCurrency(results.totalInvested - (parseFloat(formData.currentValue) || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-green-600">
                      {formatPercentage((results.totalGains / results.totalInvested) * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Annualized Return</span>
                    <span className="font-semibold text-blue-600">
                      {formatPercentage(formData.expectedReturn)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>Enter your values and click "Calculate Future Value" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
