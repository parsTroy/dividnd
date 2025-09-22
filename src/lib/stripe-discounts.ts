import { stripe } from '~/lib/stripe';
import { env } from '~/env.js';

export interface CreateDiscountCodeProps {
  code: string;
  description: string;
  percentageOff: number;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  maxRedemptions?: number;
  expiresAt?: Date;
}

export async function createDiscountCode({
  code,
  description,
  percentageOff,
  duration,
  durationInMonths,
  maxRedemptions,
  expiresAt,
}: CreateDiscountCodeProps) {
  try {
    // Create a coupon first
    const coupon = await stripe.coupons.create({
      id: code,
      percent_off: percentageOff,
      duration,
      duration_in_months: durationInMonths,
      max_redemptions: maxRedemptions,
      redeem_by: expiresAt ? Math.floor(expiresAt.getTime() / 1000) : undefined,
      metadata: {
        description,
        created_by: 'newsletter_system',
      },
    });

    return coupon;
  } catch (error) {
    console.error('Error creating discount code:', error);
    throw error;
  }
}

export async function getDiscountCode(code: string) {
  try {
    const coupon = await stripe.coupons.retrieve(code);
    return coupon;
  } catch (error) {
    console.error('Error retrieving discount code:', error);
    return null;
  }
}

export async function deleteDiscountCode(code: string) {
  try {
    await stripe.coupons.del(code);
    return true;
  } catch (error) {
    console.error('Error deleting discount code:', error);
    return false;
  }
}

export function generateDiscountCode(): string {
  // Generate a unique discount code
  const prefix = 'NEWSLETTER';
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomSuffix}`;
}

export async function createNewsletterDiscountCode(): Promise<string> {
  const code = generateDiscountCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  await createDiscountCode({
    code,
    description: 'Newsletter subscriber 15% discount',
    percentageOff: 15,
    duration: 'once',
    maxRedemptions: 1,
    expiresAt,
  });

  return code;
}
