'use client';

import Link from "next/link";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PRICING_PLANS } from '~/lib/pricing';

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planName: string) => {
    if (!session) {
      window.location.href = '/signin';
      return;
    }

    setIsLoading(priceId);
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
      setIsLoading(null);
    }
  };

  const plans = Object.entries(PRICING_PLANS).map(([tier, plan]) => ({
    ...plan,
    tier: tier as keyof typeof PRICING_PLANS,
  }));

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption and security measures to protect your data. We never share your personal information with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your dividend investment needs. All plans include our core features with no hidden fees.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price.monthly}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
                {plan.tier !== 'free' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Annual: ${plan.price.annual}/year (Save {Math.round((1 - plan.price.annual / (plan.price.monthly * 12)) * 100)}%)
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.tier === 'free' ? (
                <Link
                  href="/signin"
                  className="w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors bg-gray-900 text-white hover:bg-gray-800"
                >
                  Get Started Free
                </Link>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleUpgrade(plan.stripePriceId.monthly, `${plan.name} Monthly`)}
                    disabled={isLoading === plan.stripePriceId.monthly}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                        : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                    }`}
                  >
                    {isLoading === plan.stripePriceId.monthly ? 'Loading...' : 'Start Monthly Plan'}
                  </button>
                  <button
                    onClick={() => handleUpgrade(plan.stripePriceId.annual, `${plan.name} Annual`)}
                    disabled={isLoading === plan.stripePriceId.annual}
                    className="w-full py-2 px-6 rounded-lg font-semibold transition-colors bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    {isLoading === plan.stripePriceId.annual ? 'Loading...' : 'Start Annual Plan'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-16">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Portfolios</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.portfolios}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.portfolios === -1 ? 'Unlimited' : PRICING_PLANS.pro.limits.portfolios}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.portfolios === -1 ? 'Unlimited' : PRICING_PLANS.premium.limits.portfolios}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Stock Positions</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.positions}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.positions === -1 ? 'Unlimited' : PRICING_PLANS.pro.limits.positions}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.positions === -1 ? 'Unlimited' : PRICING_PLANS.premium.limits.positions}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">API Calls/Month</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.apiCallsPerMonth}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.apiCallsPerMonth.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.apiCallsPerMonth.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Advanced Analytics</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.advancedAnalytics ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.advancedAnalytics ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.advancedAnalytics ? '✓' : '-'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Export Data</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.exportData ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.exportData ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.exportData ? '✓' : '-'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Priority Support</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.free.limits.prioritySupport ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.pro.limits.prioritySupport ? '✓' : '-'}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{PRICING_PLANS.premium.limits.prioritySupport ? '✓' : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Tracking?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who trust <span className="text-[var(--color-primary-600)]">Dividnd</span> for their dividend portfolio management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}