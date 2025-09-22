import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/config';
import { stripe } from '~/lib/stripe';
import { db } from '~/server/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    // Get current subscription details from Stripe
    let stripeSubscription = null;
    if (subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        stripeSubscription,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, priceId } = await request.json();

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    switch (action) {
      case 'cancel': {
        const canceledSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            cancel_at_period_end: true,
          }
        );

        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: true,
          },
        });

        return NextResponse.json({ subscription: canceledSubscription });
      }

      case 'reactivate': {
        const reactivatedSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            cancel_at_period_end: false,
          }
        );

        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: false,
          },
        });

        return NextResponse.json({ subscription: reactivatedSubscription });
      }

      case 'change_plan': {
        if (!priceId) {
          return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        const updatedSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            items: [
              {
                id: subscription.stripeSubscriptionId,
                price: priceId,
              },
            ],
            proration_behavior: 'create_prorations',
          }
        );

        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            stripePriceId: priceId,
            stripeProductId: updatedSubscription.items.data[0]?.price.product as string,
          },
        });

        return NextResponse.json({ subscription: updatedSubscription });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
