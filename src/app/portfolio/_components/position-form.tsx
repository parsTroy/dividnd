"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface PositionFormProps {
  portfolioId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PositionForm({ portfolioId, onClose, onSuccess }: PositionFormProps) {
  const [formData, setFormData] = useState({
    ticker: "",
    shares: "",
    purchasePrice: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    currentPrice: "",
    dividendYield: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();

  const createPosition = api.position.create.useMutation({
    onSuccess: () => {
      utils.position.getPortfolioSummary.invalidate({ portfolioId });
      onSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const shares = parseFloat(formData.shares);
    const purchasePrice = parseFloat(formData.purchasePrice);
    const currentPrice = formData.currentPrice ? parseFloat(formData.currentPrice) : undefined;
    const dividendYield = formData.dividendYield ? parseFloat(formData.dividendYield) : undefined;

    if (isNaN(shares) || isNaN(purchasePrice) || shares <= 0 || purchasePrice <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createPosition.mutateAsync({
        portfolioId,
        ticker: formData.ticker.toUpperCase(),
        shares,
        purchasePrice,
        purchaseDate: new Date(formData.purchaseDate),
        currentPrice,
        dividendYield,
      });
    } catch (error) {
      console.error("Failed to create position:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Position</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Ticker *
            </label>
            <input
              type="text"
              id="ticker"
              value={formData.ticker}
              onChange={(e) => handleChange("ticker", e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., AAPL"
              required
              maxLength={10}
            />
          </div>

          <div>
            <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Shares *
            </label>
            <input
              type="number"
              id="shares"
              value={formData.shares}
              onChange={(e) => handleChange("shares", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price per Share *
            </label>
            <input
              type="number"
              id="purchasePrice"
              value={formData.purchasePrice}
              onChange={(e) => handleChange("purchasePrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 150.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              id="purchaseDate"
              value={formData.purchaseDate}
              onChange={(e) => handleChange("purchaseDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Current Price per Share (Optional)
            </label>
            <input
              type="number"
              id="currentPrice"
              value={formData.currentPrice}
              onChange={(e) => handleChange("currentPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 155.00"
              step="0.01"
              min="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use purchase price for calculations
            </p>
          </div>

          <div>
            <label htmlFor="dividendYield" className="block text-sm font-medium text-gray-700 mb-1">
              Dividend Yield % (Optional)
            </label>
            <input
              type="number"
              id="dividendYield"
              value={formData.dividendYield}
              onChange={(e) => handleChange("dividendYield", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3.5"
              step="0.01"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Annual dividend yield percentage
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.ticker || !formData.shares || !formData.purchasePrice}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Position"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
