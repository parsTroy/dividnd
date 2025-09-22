export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  stripePriceId: {
    monthly: string;
    annual: string;
  };
  features: string[];
  limits: {
    portfolios: number;
    positions: number;
    apiCallsPerMonth: number;
    advancedAnalytics: boolean;
    exportData: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with dividend tracking',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceId: {
      monthly: '',
      annual: '',
    },
    features: [
      '1 Portfolio',
      'Up to 10 positions',
      'Basic dividend tracking',
      'Monthly analytics',
      'Email support',
    ],
    limits: {
      portfolios: 1,
      positions: 10,
      apiCallsPerMonth: 100,
      advancedAnalytics: false,
      exportData: false,
      prioritySupport: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious dividend investors',
    price: {
      monthly: 9.99,
      annual: 99.99,
    },
    stripePriceId: {
      monthly: 'price_1QuMpaE6rMvP3MWrCGYsWEiL',
      annual: 'price_1QuMpaE6rMvP3MWrHx7SLm7G',
    },
    features: [
      '5 Portfolios',
      'Unlimited positions',
      'Advanced analytics & charts',
      'Real-time stock data',
      'Dividend calendar',
      'Export data (CSV/PDF)',
      'Email support',
      '1,000 API calls/month',
    ],
    limits: {
      portfolios: 5,
      positions: -1, // unlimited
      apiCallsPerMonth: 1000,
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: false,
    },
    popular: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'For professional investors and advisors',
    price: {
      monthly: 29.99,
      annual: 299.99,
    },
    stripePriceId: {
      monthly: 'price_premium_monthly', // Replace with actual Stripe price IDs
      annual: 'price_premium_annual',
    },
    features: [
      'Unlimited portfolios',
      'Unlimited positions',
      'All Pro features',
      'Advanced portfolio optimization',
      'Custom reporting',
      'API access',
      'Priority support',
      '10,000 API calls/month',
      'White-label options',
    ],
    limits: {
      portfolios: -1, // unlimited
      positions: -1, // unlimited
      apiCallsPerMonth: 10000,
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: true,
    },
  },
};

export function getSubscriptionTierFromPriceId(priceId: string): SubscriptionTier | null {
  for (const [tier, plan] of Object.entries(PRICING_PLANS)) {
    if (plan.stripePriceId.monthly === priceId || plan.stripePriceId.annual === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
}

export function isAnnualPlan(priceId: string): boolean {
  for (const plan of Object.values(PRICING_PLANS)) {
    if (plan.stripePriceId.annual === priceId) {
      return true;
    }
  }
  return false;
}

export function getPlanByTier(tier: SubscriptionTier): PricingPlan {
  return PRICING_PLANS[tier];
}

export function canUserAccessFeature(
  userTier: SubscriptionTier,
  feature: keyof PricingPlan['limits']
): boolean {
  const userPlan = getPlanByTier(userTier);
  return userPlan.limits[feature] === true || userPlan.limits[feature] > 0;
}

export function getUserLimits(tier: SubscriptionTier): PricingPlan['limits'] {
  return getPlanByTier(tier).limits;
}
