"use client";

import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface Position {
  id: string;
  ticker: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number | null;
  dividendYield: number | null;
  purchaseDate: Date;
}

interface EditPositionFormProps {
  position: Position;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPositionForm({ position, onClose, onSuccess }: EditPositionFormProps) {
  const [formData, setFormData] = useState({
    ticker: position.ticker,
    shares: position.shares.toString(),
    purchasePrice: position.purchasePrice.toString(),
    purchaseDate: position.purchaseDate.toISOString().split('T')[0],
    currentPrice: position.currentPrice?.toString() || '',
    dividendYield: position.dividendYield?.toString() || '',
  });

  const [isLoadingStockData, setIsLoadingStockData] = useState(false);
  const [stockData, setStockData] = useState<any>(null);

  const updatePosition = api.position.update.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const getStockData = api.stock.getStockData.useQuery(
    { symbol: formData.ticker },
    { enabled: false }
  );

  // Auto-fetch stock data when ticker changes
  useEffect(() => {
    if (formData.ticker && formData.ticker !== position.ticker) {
      const timeoutId = setTimeout(async () => {
        setIsLoadingStockData(true);
        try {
          const result = await getStockData.refetch();
          if (result.data) {
            setStockData(result.data);
            setFormData(prev => ({
              ...prev,
              currentPrice: result.data?.price?.toString() || prev.currentPrice,
              dividendYield: result.data?.dividendYield?.toString() || prev.dividendYield,
            }));
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        } finally {
          setIsLoadingStockData(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.ticker, position.ticker]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updatePosition.mutateAsync({
      id: position.id,
      ticker: formData.ticker.toUpperCase(),
      shares: parseFloat(formData.shares),
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: new Date(formData.purchaseDate),
      currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : null,
      dividendYield: formData.dividendYield ? parseFloat(formData.dividendYield) : null,
    });
  };

  const isSubmitting = updatePosition.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Edit Position</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Ticker *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ticker"
                    value={formData.ticker}
                    onChange={(e) => handleChange("ticker", e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., AAPL"
                    required
                    maxLength={10}
                  />
                  {isLoadingStockData && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {stockData && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm text-green-800">
                      <strong>{stockData.symbol}</strong> - ${stockData.price.toFixed(2)}
                      {stockData.change >= 0 ? ' (+' : ' ('}{stockData.change.toFixed(2)}, {stockData.changePercent.toFixed(2)}%)
                      {stockData.dividendYield && (
                        <span className="ml-2 text-green-600">
                          • {stockData.dividendYield.toFixed(2)}% yield
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Shares *
                </label>
                <input
                  type="number"
                  id="shares"
                  value={formData.shares}
                  onChange={(e) => handleChange("shares", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 10"
                  step="0.001"
                  min="0.001"
                  required
                />
              </div>

              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price per Share *
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={(e) => handleChange("purchasePrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 150.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price per Share {stockData ? '(Auto-populated)' : '(Optional)'}
                </label>
                <input
                  type="number"
                  id="currentPrice"
                  value={formData.currentPrice}
                  onChange={(e) => handleChange("currentPrice", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    stockData ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 155.00"
                  step="0.01"
                  min="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {stockData ? 'Auto-populated from live data' : 'Leave empty to use purchase price for calculations'}
                </p>
              </div>

              <div>
                <label htmlFor="dividendYield" className="block text-sm font-medium text-gray-700 mb-2">
                  Dividend Yield % {stockData?.dividendYield ? '(Auto-populated)' : '(Optional)'}
                </label>
                <input
                  type="number"
                  id="dividendYield"
                  value={formData.dividendYield}
                  onChange={(e) => handleChange("dividendYield", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    stockData?.dividendYield ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3.5"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {stockData?.dividendYield ? 'Auto-populated from live data' : 'Annual dividend yield percentage'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.ticker || !formData.shares || !formData.purchasePrice}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Updating..." : "Update Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
