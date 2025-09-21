"use client";

import { api } from "~/trpc/react";

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    positions: number;
  };
}

interface PortfolioListProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
}

export function PortfolioList({ portfolios, selectedPortfolioId, onSelectPortfolio }: PortfolioListProps) {
  const utils = api.useUtils();

  const deletePortfolio = api.portfolio.delete.useMutation({
    onSuccess: () => {
      utils.portfolio.getAll.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this portfolio? This will also delete all positions.")) {
      await deletePortfolio.mutateAsync({ id });
    }
  };

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No portfolios yet. Create your first portfolio to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedPortfolioId === portfolio.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelectPortfolio(portfolio.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(portfolio.id);
              }}
              className="text-red-500 hover:text-red-700 text-sm"
              disabled={deletePortfolio.isPending}
            >
              Delete
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {portfolio._count.positions} position{portfolio._count.positions !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            Created {new Date(portfolio.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
