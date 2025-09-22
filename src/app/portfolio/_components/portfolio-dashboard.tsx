"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
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
  const utils = api.useUtils();

  const deletePortfolio = api.portfolio.delete.useMutation({
    onSuccess: () => {
      utils.portfolio.getAll.invalidate();
      // If we deleted the currently selected portfolio, clear the selection
      if (selectedPortfolioId) {
        setSelectedPortfolioId(null);
      }
    },
  });

  const setMainPortfolio = api.portfolio.setMain.useMutation({
    onSuccess: () => {
      utils.portfolio.getAll.invalidate();
    },
  });

  // Auto-select the main portfolio or first portfolio
  React.useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      const mainPortfolio = portfolios.find(p => p.isMain);
      setSelectedPortfolioId(mainPortfolio?.id || portfolios[0]?.id || null);
    }
  }, [portfolios, selectedPortfolioId]);

  if (portfoliosLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading portfolios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <p className="text-sm text-gray-600">Track your dividend investments</p>
            </div>
            
            {/* Portfolio Selector & Actions */}
            <div className="flex items-center space-x-4">
              {/* Portfolio Dropdown */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={selectedPortfolioId || ''}
                    onChange={(e) => setSelectedPortfolioId(e.target.value || null)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                  >
                    <option value="">Select Portfolio</option>
                    {portfolios?.map((portfolio) => (
                      <option key={portfolio.id} value={portfolio.id}>
                        {portfolio.name} {portfolio.isMain && '(Main)'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Portfolio Actions */}
                {selectedPortfolioId && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        const portfolio = portfolios?.find(p => p.id === selectedPortfolioId);
                        if (portfolio) {
                          setEditingPortfolio(portfolio);
                          setShowEditPortfolio(true);
                        }
                      }}
                      className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      title="Edit Portfolio"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {(() => {
                      const currentPortfolio = portfolios?.find(p => p.id === selectedPortfolioId);
                      if (!currentPortfolio) return null;
                      
                      return (
                        <>
                          {!currentPortfolio.isMain && (
                            <button
                              onClick={() => {
                                setMainPortfolio.mutate({ id: selectedPortfolioId });
                              }}
                              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              title="Set as Main Portfolio"
                              disabled={setMainPortfolio.isPending}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {!currentPortfolio.isMain && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${currentPortfolio.name}"? This will also delete all positions in this portfolio.`)) {
                                  deletePortfolio.mutate({ id: selectedPortfolioId });
                                }
                              }}
                              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                              title="Delete Portfolio"
                              disabled={deletePortfolio.isPending}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreatePortfolio(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Portfolio
                </button>
                {selectedPortfolioId && (
                  <button
                    onClick={() => setShowAddPosition(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Position
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Dividend Goals Section */}
      {selectedPortfolioId && portfolioSummary && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <CompactDividendGoals
              monthlyDividendGoal={portfolioSummary.portfolio.monthlyDividendGoal}
              annualDividendGoal={portfolioSummary.portfolio.annualDividendGoal}
              monthlyDividendIncome={portfolioSummary.summary.totalAnnualDividends / 12}
              annualDividendIncome={portfolioSummary.summary.totalAnnualDividends}
              onSetGoals={() => {
                // Scroll to the goal setting section in PortfolioAnalytics
                const goalSection = document.querySelector('[data-goal-section]');
                if (goalSection) {
                  goalSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPortfolioId && portfolioSummary ? (
          <>
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
              currentPositions={portfolioSummary.positions.map(pos => ({ ticker: pos.ticker }))}
            />
            
            {/* Positions Table */}
            <div className="mt-8">
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Positions</h3>
                </div>
                <PositionList
                  portfolioId={selectedPortfolioId}
                  onEditPosition={(position) => {
                    setEditingPosition(position);
                    setShowEditPosition(true);
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Portfolio Selected</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Select a portfolio from the dropdown above to view your positions and analytics, or create your first portfolio to get started.</p>
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Portfolio
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreatePortfolio && (
        <CreatePortfolioForm
          onClose={() => setShowCreatePortfolio(false)}
          onSuccess={() => {
            setShowCreatePortfolio(false);
            void utils.portfolio.getAll.invalidate();
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
            void utils.portfolio.getAll.invalidate();
            if (selectedPortfolioId) {
              void utils.position.getPortfolioSummary.invalidate({ portfolioId: selectedPortfolioId });
            }
          }}
        />
      )}

      {showAddPosition && selectedPortfolioId && (
        <PositionForm
          portfolioId={selectedPortfolioId}
          onClose={() => setShowAddPosition(false)}
          onSuccess={() => {
            setShowAddPosition(false);
            void utils.position.getPortfolioSummary.invalidate({ portfolioId: selectedPortfolioId });
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
              void utils.position.getPortfolioSummary.invalidate({ portfolioId: selectedPortfolioId });
            }
          }}
        />
      )}

    </div>
  );
}

// Position List Component (moved from separate file for cleaner structure)
function PositionList({ portfolioId, onEditPosition }: { portfolioId: string; onEditPosition: (position: any) => void }) {
  const { data: portfolioData, isLoading } = api.position.getPortfolioSummary.useQuery({ 
    portfolioId 
  });
  const utils = api.useUtils();

  const deletePosition = api.position.delete.useMutation({
    onSuccess: () => {
      void utils.position.getPortfolioSummary.invalidate({ portfolioId });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading positions...</div>
      </div>
    );
  }

  if (!portfolioData?.positions || portfolioData.positions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No positions found</div>
        <p className="text-sm text-gray-400">Add your first position to get started</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
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
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              P&L
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yield
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {portfolioData.positions.map((position) => {
            const currentPrice = position.currentPrice ?? position.purchasePrice;
            const marketValue = position.shares * currentPrice;
            const costBasis = position.shares * position.purchasePrice;
            const pnl = marketValue - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            return (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{position.ticker}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.shares}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(position.purchasePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(currentPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(marketValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(pnl)} ({formatPercent(pnlPercent)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.dividendYield ? `${position.dividendYield.toFixed(2)}%` : 'N/A'}
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
  );
}

// Compact Dividend Goals Component
function CompactDividendGoals({ 
  monthlyDividendGoal, 
  annualDividendGoal, 
  monthlyDividendIncome, 
  annualDividendIncome,
  onSetGoals 
}: {
  monthlyDividendGoal: number | null;
  annualDividendGoal: number | null;
  monthlyDividendIncome: number;
  annualDividendIncome: number;
  onSetGoals: () => void;
}) {
  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const monthlyProgress = monthlyDividendGoal ? (monthlyDividendIncome / monthlyDividendGoal) * 100 : 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Dividend Goals</div>
            <div className="text-xs text-gray-500">
              {monthlyDividendGoal ? `Monthly: ${formatCurrency(monthlyDividendGoal)}` : 'No goals set'}
            </div>
          </div>
        </div>

        {monthlyDividendGoal && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {monthlyProgress.toFixed(1)}%
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(monthlyDividendIncome)}/mo
              </div>
              <div className="text-xs text-gray-500">
                of {formatCurrency(monthlyDividendGoal)} goal
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onSetGoals}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Set Goals
      </button>
    </div>
  );
}