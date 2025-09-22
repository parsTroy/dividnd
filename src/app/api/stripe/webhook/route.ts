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
          console.error('No userId in checkout session metadata');
          break;
        }

        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        
        if (!priceId) {
          console.error('No price ID found in subscription');
          break;
        }

        const tier = getSubscriptionTierFromPriceId(priceId);
        if (!tier) {
          console.error('Invalid price ID:', priceId);
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
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeProductId: subscription.items.data[0]?.price.product as string,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        
        if (!priceId) {
          console.error('No price ID found in subscription update');
          break;
        }

        const tier = getSubscriptionTierFromPriceId(priceId);
        if (!tier) {
          console.error('Invalid price ID in subscription update:', priceId);
          break;
        }

        // Find subscription by Stripe subscription ID
        const existingSubscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              stripePriceId: priceId,
              stripeProductId: subscription.items.data[0]?.price.product as string,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            },
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Find and update subscription
        const existingSubscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existingSubscription) {
          await db.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              status: 'canceled',
              canceledAt: new Date(),
            },
          });
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          const existingSubscription = await db.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (existingSubscription) {
            await db.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          const existingSubscription = await db.subscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (existingSubscription) {
            await db.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: 'past_due',
              },
            });
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
