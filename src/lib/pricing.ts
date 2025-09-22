export type SubscriptionTier = 'free' | 'premium';

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
      advancedAnalytics: false,
      exportData: false,
      prioritySupport: false,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'For serious dividend investors and professionals',
    price: {
      monthly: 6.99,
      annual: 69.99,
    },
    stripePriceId: {
      monthly: 'prod_T6V1W9YKVMLmga',
      annual: 'prod_T6V1S8RjZ6rw9I',
    },
    features: [
      'Unlimited portfolios',
      'Unlimited positions',
      'Advanced analytics & charts',
      'Real-time stock data',
      'Dividend calendar',
      'Export data (CSV/PDF)',
      'Advanced portfolio optimization',
      'Custom reporting',
      'Priority support',
      'White-label options',
    ],
    limits: {
      portfolios: -1, // unlimited
      positions: -1, // unlimited
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: true,
    },
    popular: true,
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
  const limit = userPlan.limits[feature];
  
  if (typeof limit === 'boolean') {
    return limit;
  }
  
  return limit > 0;
}

export function getUserLimits(tier: SubscriptionTier): PricingPlan['limits'] {
  return getPlanByTier(tier).limits;
}
