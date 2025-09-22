import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '~/lib/stripe';
import { db } from '~/server/db';
import { env } from '~/env.js';
import { getSubscriptionTierFromPriceId } from '~/lib/pricing';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('No userId in session metadata');
          break;
        }

        // Get the subscription from the session
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) {
          console.error('No subscription ID in session');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        if (!priceId) {
          console.error('No price ID found in subscription');
          break;
        }

        // Update subscription in database
        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeProductId: subscription.items.data[0]?.price.product as string,
            status: subscription.status,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
            trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : null,
            trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeProductId: subscription.items.data[0]?.price.product as string,
            status: subscription.status,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
            trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : null,
            trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
          },
        });

        console.log(`Subscription created for user ${userId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSubscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!userSubscription) {
          console.error('No subscription found for customer:', customerId);
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;

        await db.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeProductId: subscription.items.data[0]?.price.product as string,
            status: subscription.status,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
            trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : null,
            trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
          },
        });

        console.log(`Subscription updated for user ${userSubscription.userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSubscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!userSubscription) {
          console.error('No subscription found for customer:', customerId);
          break;
        }

        await db.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
          },
        });

        console.log(`Subscription canceled for user ${userSubscription.userId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (!subscriptionId) {
          console.log('No subscription ID in invoice, skipping');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSubscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!userSubscription) {
          console.error('No subscription found for customer:', customerId);
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;

        await db.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Payment succeeded for user ${userSubscription.userId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (!subscriptionId) {
          console.log('No subscription ID in invoice, skipping');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSubscription = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!userSubscription) {
          console.error('No subscription found for customer:', customerId);
          break;
        }

        await db.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            status: 'past_due',
          },
        });

        console.log(`Payment failed for user ${userSubscription.userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}