"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { PortfolioList } from "./portfolio-list";
import { CreatePortfolioForm } from "./create-portfolio-form";
import { PositionForm } from "./position-form";

export function PortfolioDashboard() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showAddPosition, setShowAddPosition] = useState(false);

  const { data: portfolios, isLoading: portfoliosLoading } = api.portfolio.getAll.useQuery();

  if (portfoliosLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading portfolios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Management */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Portfolios</h2>
          <button
            onClick={() => setShowCreatePortfolio(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Portfolio
          </button>
        </div>
        
        <PortfolioList 
          portfolios={portfolios ?? []}
          selectedPortfolioId={selectedPortfolioId}
          onSelectPortfolio={setSelectedPortfolioId}
        />
      </div>

      {/* Position Management */}
      {selectedPortfolioId && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Positions</h2>
            <button
              onClick={() => setShowAddPosition(true)}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Position
            </button>
          </div>
          
          <PositionList portfolioId={selectedPortfolioId} />
        </div>
      )}

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
    </div>
  );
}

function PositionList({ portfolioId }: { portfolioId: string }) {
  const { data: portfolioData, isLoading } = api.position.getPortfolioSummary.useQuery({ 
    portfolioId 
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
