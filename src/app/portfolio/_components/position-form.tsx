"use client";

import { useState, useEffect } from "react";
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
  const [isLoadingStockData, setIsLoadingStockData] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = api.useUtils();

  const createPosition = api.position.create.useMutation({
    onSuccess: () => {
      utils.position.getPortfolioSummary.invalidate({ portfolioId });
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  // Fetch stock data when ticker changes
  const { refetch: fetchStockData } = api.stock.getStockData.useQuery(
    { symbol: formData.ticker },
    { 
      enabled: false, // Don't auto-fetch
      retry: false 
    }
  );

  // Auto-fetch stock data when ticker is entered
  useEffect(() => {
    if (formData.ticker && formData.ticker.length >= 1) {
      const timeoutId = setTimeout(async () => {
        setIsLoadingStockData(true);
        try {
          const result = await fetchStockData();
          if (result.data) {
            setStockData(result.data);
            setFormData(prev => ({
              ...prev,
              currentPrice: result.data?.price?.toString() || "",
              dividendYield: result.data?.dividendYield?.toString() || ""
            }));
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        } finally {
          setIsLoadingStockData(false);
        }
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setStockData(null);
      setFormData(prev => ({
        ...prev,
        currentPrice: "",
        dividendYield: ""
      }));
    }
  }, [formData.ticker]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const shares = parseFloat(formData.shares);
    const purchasePrice = parseFloat(formData.purchasePrice);
    const currentPrice = formData.currentPrice ? parseFloat(formData.currentPrice) : undefined;
    const dividendYield = formData.dividendYield ? parseFloat(formData.dividendYield) : undefined;

    if (isNaN(shares) || isNaN(purchasePrice) || shares <= 0 || purchasePrice <= 0) {
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await createPosition.mutateAsync({
        portfolioId,
        ticker: formData.ticker.toUpperCase(),
        shares,
        purchasePrice,
        purchaseDate: new Date(formData.purchaseDate || new Date()),
        currentPrice,
        dividendYield,
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Add New Position</h2>
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
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Position Limit Reached
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                        <div className="mt-3">
                          <a
                            href="/pricing"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Upgrade to Premium
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                <div className="text-xs text-green-600 mt-1">
                  Data from {stockData.source} • Updated {new Date(stockData.lastUpdated).toLocaleTimeString()}
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
              placeholder="e.g., 100"
              step="0.01"
              min="0.01"
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Position"}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
