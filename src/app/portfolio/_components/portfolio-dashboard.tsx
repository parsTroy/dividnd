"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { PortfolioList } from "./portfolio-list";
import { CreatePortfolioForm } from "./create-portfolio-form";
import { EditPortfolioForm } from "./edit-portfolio-form";
import { PositionForm } from "./position-form";
import { EditPositionForm } from "./edit-position-form";
import { PortfolioAnalytics } from "./portfolio-analytics";

export function PortfolioDashboard() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showEditPortfolio, setShowEditPortfolio] = useState(false);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [showEditPosition, setShowEditPosition] = useState(false);
  const [editingPosition, setEditingPosition] = useState<any>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);

  const { data: portfolios, isLoading: portfoliosLoading } = api.portfolio.getAll.useQuery();
  const { data: portfolioSummary } = api.position.getPortfolioSummary.useQuery(
    { portfolioId: selectedPortfolioId! },
    { enabled: !!selectedPortfolioId }
  );

  // Auto-select the main portfolio or first portfolio
  React.useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      const mainPortfolio = portfolios.find(p => p.isMain);
      setSelectedPortfolioId(mainPortfolio?.id || portfolios[0]?.id || null);
    }
  }, [portfolios, selectedPortfolioId]);
  

  if (portfoliosLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading portfolios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <p className="text-sm text-gray-600">Track your dividend investments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreatePortfolio(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Portfolio
              </button>
              {selectedPortfolioId && (
                <button
                  onClick={() => setShowAddPosition(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Portfolio Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Portfolios</h2>
                <p className="text-sm text-gray-600 mt-1">Select a portfolio to view positions</p>
              </div>
              <div className="p-6">
                    <PortfolioList
                      portfolios={portfolios ?? []}
                      selectedPortfolioId={selectedPortfolioId}
                      onSelectPortfolio={setSelectedPortfolioId}
                      onEditPortfolio={(portfolio) => {
                        setEditingPortfolio(portfolio);
                        setShowEditPortfolio(true);
                      }}
                    />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedPortfolioId ? (
              <div className="space-y-6">
                {/* Portfolio Analytics */}
                {portfolioSummary && (
                  <PortfolioAnalytics
                    positions={portfolioSummary.positions.map(pos => ({
                      id: pos.id,
                      ticker: pos.ticker,
                      shares: pos.shares,
                      purchasePrice: pos.purchasePrice,
                      currentPrice: pos.currentPrice ?? pos.purchasePrice,
                      dividendYield: pos.dividendYield ?? undefined,
                      purchaseDate: pos.purchaseDate,
                    }))}
                    totalInvested={portfolioSummary.summary.totalInvested}
                    currentValue={portfolioSummary.summary.totalCurrentValue}
                    unrealizedPnL={portfolioSummary.summary.totalUnrealizedGainLoss}
                    annualDividends={portfolioSummary.summary.totalAnnualDividends}
                    portfolioId={selectedPortfolioId}
                    monthlyDividendGoal={portfolioSummary.portfolio.monthlyDividendGoal}
                    annualDividendGoal={portfolioSummary.portfolio.annualDividendGoal}
                  />
                )}
                
                {/* Portfolio Positions Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Positions</h3>
                  <PositionList 
                    portfolioId={selectedPortfolioId} 
                    onEditPosition={(position) => {
                      setEditingPosition(position);
                      setShowEditPosition(true);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Portfolio Selected</h3>
                <p className="mt-2 text-sm text-gray-500">Choose a portfolio from the sidebar to view your positions and performance.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreatePortfolio(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Portfolio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreatePortfolio && (
        <CreatePortfolioForm 
          onClose={() => setShowCreatePortfolio(false)}
          onSuccess={() => {
            setShowCreatePortfolio(false);
            // Refetch portfolios
            window.location.reload();
          }}
        />
      )}

      {showAddPosition && selectedPortfolioId && (
        <PositionForm 
          portfolioId={selectedPortfolioId}
          onClose={() => setShowAddPosition(false)}
          onSuccess={() => {
            setShowAddPosition(false);
            // Refetch positions
            window.location.reload();
          }}
        />
      )}

      {showEditPortfolio && editingPortfolio && (
        <EditPortfolioForm
          portfolio={editingPortfolio}
          onClose={() => {
            setShowEditPortfolio(false);
            setEditingPortfolio(null);
          }}
          onSuccess={() => {
            setShowEditPortfolio(false);
            setEditingPortfolio(null);
            void api.useUtils().portfolio.getAll.invalidate();
          }}
        />
      )}

      {showEditPosition && editingPosition && (
        <EditPositionForm
          position={editingPosition}
          onClose={() => {
            setShowEditPosition(false);
            setEditingPosition(null);
          }}
          onSuccess={() => {
            setShowEditPosition(false);
            setEditingPosition(null);
            if (selectedPortfolioId) {
              void api.useUtils().position.getPortfolioSummary.invalidate({ portfolioId: selectedPortfolioId });
            }
          }}
        />
      )}
    </div>
  );
}

function PositionList({ portfolioId, onEditPosition }: { portfolioId: string; onEditPosition: (position: any) => void }) {
  const { data: portfolioData, isLoading } = api.position.getPortfolioSummary.useQuery({ 
    portfolioId 
  });

  const deletePosition = api.position.delete.useMutation({
    onSuccess: () => {
      void api.useUtils().position.getPortfolioSummary.invalidate({ portfolioId });
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading positions...</div>;
  }

  if (!portfolioData) {
    return <div className="text-center py-4 text-gray-500">No portfolio found</div>;
  }

  const { positions, summary } = portfolioData;

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${summary.totalInvested.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Invested</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${summary.totalCurrentValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Current Value</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${summary.totalUnrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.totalUnrealizedGainLoss >= 0 ? '+' : ''}${summary.totalUnrealizedGainLoss.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Unrealized P&L</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            ${summary.totalAnnualDividends.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Annual Dividends</div>
        </div>
      </div>

      {/* Positions Table */}
      {positions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No positions yet. Add your first position to get started.
        </div>
      ) : (
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
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dividend Yield
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Dividends
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((position) => {
                const marketValue = position.shares * (position.currentPrice ?? position.purchasePrice);
                const annualDividends = position.shares * (position.purchasePrice * (position.dividendYield ?? 0) / 100);
                
                return (
                  <tr key={position.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {position.ticker}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${position.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(position.currentPrice ?? position.purchasePrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${marketValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.dividendYield ? `${position.dividendYield.toFixed(2)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${annualDividends.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditPosition(position)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete this position (${position.ticker})?`)) {
                              deletePosition.mutate({ id: position.id });
                            }
                          }}
                          className="text-red-600 hover:text-red-900 font-medium"
                          disabled={deletePosition.isPending}
                        >
                          {deletePosition.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
