'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { PRICING_PLANS, type SubscriptionTier } from '~/lib/pricing';
import { formatAmountFromStripe } from '~/lib/stripe';
import Image from 'next/image';
import { ProfileEditModal } from '~/components/profile-edit-modal';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: subscriptionData, refetch } = api.subscription.getCurrent.useQuery();
  const { data: usageData } = api.subscription.getUsage.useQuery();
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

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

  // Calculate time since account creation
  const accountCreatedAt = new Date(session.user.createdAt || Date.now());
  const timeSinceCreation = Math.floor((Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceCreation = timeSinceCreation;
  const monthsSinceCreation = Math.floor(daysSinceCreation / 30);
  const yearsSinceCreation = Math.floor(daysSinceCreation / 365);

  // Calculate subscription renewal info
  const getRenewalInfo = () => {
    if (!subscription?.currentPeriodEnd) return null;
    
    const renewalDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      renewalDate,
      daysUntilRenewal,
      isActive: subscription.status === 'active' && !subscription.cancelAtPeriodEnd,
    };
  };

  const renewalInfo = getRenewalInfo();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile, subscription, and account preferences</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-600">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {session.user.name || 'User'}
                  </h3>
                  <button
                    onClick={() => setIsProfileEditOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-600">{session.user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {accountCreatedAt.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Account Age</span>
                <span className="text-sm font-medium text-gray-900">
                  {yearsSinceCreation > 0 && `${yearsSinceCreation}y `}
                  {monthsSinceCreation > 0 && `${monthsSinceCreation % 12}m `}
                  {daysSinceCreation % 30}d
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Current Plan</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  currentTier === 'free' ? 'bg-gray-100 text-gray-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {currentPlan.name}
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          {usageData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Portfolios</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {usageData.usage.portfolios}
                    {currentPlan.limits.portfolios !== -1 && (
                      <span className="text-sm text-gray-500">/{currentPlan.limits.portfolios}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Positions</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {usageData.usage.positions}
                    {currentPlan.limits.positions !== -1 && (
                      <span className="text-sm text-gray-500">/{currentPlan.limits.positions}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Usage Progress Bars */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Portfolio Usage</span>
                    <span>{usageData.usage.portfolios}/{currentPlan.limits.portfolios === -1 ? '∞' : currentPlan.limits.portfolios}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${currentPlan.limits.portfolios === -1 ? 0 : Math.min((usageData.usage.portfolios / currentPlan.limits.portfolios) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Position Usage</span>
                    <span>{usageData.usage.positions}/{currentPlan.limits.positions === -1 ? '∞' : currentPlan.limits.positions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${currentPlan.limits.positions === -1 ? 0 : Math.min((usageData.usage.positions / currentPlan.limits.positions) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Subscription Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Subscription */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentPlan.name}</h3>
                <p className="text-gray-600">{currentPlan.description}</p>
                {renewalInfo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {renewalInfo.isActive ? 'Renews' : 'Expires'} on{' '}
                      <span className="font-medium">
                        {renewalInfo.renewalDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {' '}({renewalInfo.daysUntilRenewal} days)
                    </p>
                  </div>
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

          {/* Plan Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentPlan.limits).map(([feature, limit]) => (
                <div key={feature} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {typeof limit === 'boolean' ? (limit ? '✓' : '✗') : 
                     limit === -1 ? 'Unlimited' : limit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Options */}
          {currentTier === 'free' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upgrade to Premium</h2>
              <div className="max-w-md mx-auto">
                <div className="border rounded-lg p-6 border-blue-500 bg-blue-50">
                  <div className="text-center mb-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{PRICING_PLANS.premium.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">{PRICING_PLANS.premium.description}</p>
                  <div className="mb-4 text-center">
                    <span className="text-3xl font-bold text-gray-900">${PRICING_PLANS.premium.price.monthly}</span>
                    <span className="text-gray-500">/month</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (${PRICING_PLANS.premium.price.annual}/year - Save {Math.round((1 - PRICING_PLANS.premium.price.annual / (PRICING_PLANS.premium.price.monthly * 12)) * 100)}%)
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 mb-6 space-y-2">
                    {PRICING_PLANS.premium.features.slice(0, 6).map((feature, index) => (
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
                      onClick={() => handleUpgrade(PRICING_PLANS.premium.stripePriceId.monthly)}
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Upgrade to Monthly'}
                    </button>
                    <button
                      onClick={() => handleUpgrade(PRICING_PLANS.premium.stripePriceId.annual)}
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Upgrade to Annual'}
                    </button>
                  </div>
                </div>
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
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isProfileEditOpen} 
        onClose={() => setIsProfileEditOpen(false)} 
      />
    </div>
  );
}