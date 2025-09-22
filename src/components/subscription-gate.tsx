'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { PRICING_PLANS } from '~/lib/pricing';
import Link from 'next/link';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: keyof typeof PRICING_PLANS.free.limits;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function SubscriptionGate({ 
  children, 
  feature, 
  fallback,
  showUpgrade = true 
}: SubscriptionGateProps) {
  const { data: session } = useSession();
  const { data: subscriptionData } = api.subscription.getCurrent.useQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    if (!session) {
      window.location.href = '/signin';
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error upgrading:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscriptionData) {
    return <div>Loading...</div>;
  }

  const hasAccess = subscriptionData.limits[feature];
  const currentTier = subscriptionData.tier;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const proPlan = PRICING_PLANS.pro;
  const premiumPlan = PRICING_PLANS.premium;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {feature === 'portfolios' && 'Upgrade to Create More Portfolios'}
          {feature === 'positions' && 'Upgrade to Add More Positions'}
          {feature === 'advancedAnalytics' && 'Upgrade for Advanced Analytics'}
          {feature === 'exportData' && 'Upgrade to Export Your Data'}
          {feature === 'prioritySupport' && 'Upgrade for Priority Support'}
          {feature === 'apiCallsPerMonth' && 'Upgrade for More API Calls'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          This feature is available with our Pro and Premium plans. Upgrade now to unlock this and many other powerful features.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-left">
              <h4 className="font-medium text-gray-900">{proPlan.name}</h4>
              <p className="text-sm text-gray-600">${proPlan.price.monthly}/month</p>
            </div>
            <button
              onClick={() => handleUpgrade(proPlan.stripePriceId.monthly)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {isLoading ? 'Loading...' : 'Upgrade'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-left">
              <h4 className="font-medium text-gray-900">{premiumPlan.name}</h4>
              <p className="text-sm text-gray-600">${premiumPlan.price.monthly}/month</p>
            </div>
            <button
              onClick={() => handleUpgrade(premiumPlan.stripePriceId.monthly)}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
            >
              {isLoading ? 'Loading...' : 'Upgrade'}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/pricing"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all plans and features →
          </Link>
        </div>
      </div>
    </div>
  );
}
