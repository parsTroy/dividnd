'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { PRICING_PLANS, type SubscriptionTier } from '~/lib/pricing';
import { formatAmountFromStripe } from '~/lib/stripe';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: subscriptionData, refetch } = api.subscription.getCurrent.useQuery();
  const { data: usageData } = api.subscription.getUsage.useQuery();

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true);
    setError(null);

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

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reactivate' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reactivate subscription');
      }

      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in to view your settings</h1>
        </div>
      </div>
    );
  }

  const currentTier = subscriptionData?.tier || 'free';
  const currentPlan = PRICING_PLANS[currentTier];
  const subscription = subscriptionData?.subscription;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and account preferences</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{currentPlan.name}</h3>
            <p className="text-gray-600">{currentPlan.description}</p>
            {subscription?.currentPeriodEnd && (
              <p className="text-sm text-gray-500 mt-1">
                {subscription.cancelAtPeriodEnd ? 'Expires' : 'Renews'} on{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${currentPlan.price.monthly}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </p>
            {currentTier !== 'free' && (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            )}
          </div>
        </div>

        {subscription?.cancelAtPeriodEnd && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              Your subscription will be canceled at the end of the current billing period.
            </p>
            <button
              onClick={handleReactivateSubscription}
              disabled={isLoading}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Reactivating...' : 'Reactivate Subscription'}
            </button>
          </div>
        )}
      </div>

      {/* Usage Stats */}
      {usageData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Portfolios</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageData.usage.portfolios} / {currentPlan.limits.portfolios === -1 ? '∞' : currentPlan.limits.portfolios}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageData.usage.positions} / {currentPlan.limits.positions === -1 ? '∞' : currentPlan.limits.positions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Options */}
      {currentTier === 'free' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upgrade Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(PRICING_PLANS).filter(([tier]) => tier !== 'free').map(([tier, plan]) => (
              <div key={tier} className={`border rounded-lg p-6 ${plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price.monthly}</span>
                  <span className="text-gray-500">/month</span>
                  <span className="text-sm text-gray-500 ml-2">
                    (${plan.price.annual}/year - Save {Math.round((1 - plan.price.annual / (plan.price.monthly * 12)) * 100)}%)
                  </span>
                </div>
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpgrade(plan.stripePriceId.monthly)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Upgrade to Monthly'}
                  </button>
                  <button
                    onClick={() => handleUpgrade(plan.stripePriceId.annual)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Upgrade to Annual'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Subscription */}
      {currentTier !== 'free' && !subscription?.cancelAtPeriodEnd && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancel Subscription</h2>
          <p className="text-gray-600 mb-4">
            You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
          </p>
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Canceling...' : 'Cancel Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}
