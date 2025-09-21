"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

interface Portfolio {
  id: string;
  name: string;
  isMain: boolean;
  monthlyDividendGoal: number | null;
  annualDividendGoal: number | null;
}

interface EditPortfolioFormProps {
  portfolio: Portfolio;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPortfolioForm({ portfolio, onClose, onSuccess }: EditPortfolioFormProps) {
  const [formData, setFormData] = useState({
    name: portfolio.name,
    monthlyDividendGoal: portfolio.monthlyDividendGoal?.toString() || '',
  });

  const updatePortfolio = api.portfolio.update.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const updateGoals = api.portfolio.updateMonthlyDividendGoal.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update portfolio name
    await updatePortfolio.mutateAsync({
      id: portfolio.id,
      name: formData.name,
    });

    // Update monthly dividend goal (annual is auto-calculated)
    await updateGoals.mutateAsync({
      id: portfolio.id,
      monthlyDividendGoal: formData.monthlyDividendGoal ? parseFloat(formData.monthlyDividendGoal) : undefined,
    });
  };

  const isSubmitting = updatePortfolio.isPending || updateGoals.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Edit Portfolio</h2>
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
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., My Dividend Portfolio"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="monthlyDividendGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Dividend Goal ($)
                </label>
                <input
                  type="number"
                  id="monthlyDividendGoal"
                  value={formData.monthlyDividendGoal}
                  onChange={(e) => handleChange("monthlyDividendGoal", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 1000"
                  step="0.01"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Annual equivalent: ${formData.monthlyDividendGoal ? (parseFloat(formData.monthlyDividendGoal) * 12).toLocaleString() : '0'}
                </p>
              </div>
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
                disabled={isSubmitting || !formData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Updating..." : "Update Portfolio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
