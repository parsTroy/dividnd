import { db } from '~/server/db';
import { getSubscriptionTierFromPriceId, type SubscriptionTier, PRICING_PLANS } from '~/lib/pricing';

export async function getUserSubscription(userId: string) {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return {
      tier: 'free' as SubscriptionTier,
      status: 'active',
      limits: PRICING_PLANS.free.limits,
    };
  }

  // Determine tier from price ID
  let tier: SubscriptionTier = 'free';
  if (subscription.stripePriceId) {
    const tierFromPrice = getSubscriptionTierFromPriceId(subscription.stripePriceId);
    if (tierFromPrice) {
      tier = tierFromPrice;
    }
  }

  // Check if subscription is active
  const isActive = subscription.status === 'active' && 
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date());

  return {
    tier: isActive ? tier : 'free',
    status: subscription.status,
    limits: PRICING_PLANS[isActive ? tier : 'free'].limits,
    subscription,
  };
}

export function canUserAccessFeature(
  userTier: SubscriptionTier,
  feature: keyof typeof PRICING_PLANS.free.limits
): boolean {
  const plan = PRICING_PLANS[userTier];
  const limit = plan.limits[feature];
  
  if (typeof limit === 'boolean') {
    return limit;
  }
  
  return limit > 0;
}

export function getUserLimits(tier: SubscriptionTier) {
  return PRICING_PLANS[tier].limits;
}

export function isSubscriptionActive(status: string, currentPeriodEnd?: Date | null): boolean {
  if (status !== 'active') return false;
  if (!currentPeriodEnd) return true;
  return currentPeriodEnd > new Date();
}
