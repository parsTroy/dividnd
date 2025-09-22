import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email && !token) {
      return NextResponse.json(
        { error: 'Email or token is required' },
        { status: 400 }
      );
    }

    let subscription;

    if (email) {
      subscription = await db.newsletterSubscription.findUnique({
        where: { email },
      });
    } else if (token) {
      subscription = await db.newsletterSubscription.findUnique({
        where: { confirmationToken: token },
      });
    }

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.unsubscribedAt) {
      return NextResponse.json({
        message: 'Email already unsubscribed',
        alreadyUnsubscribed: true,
      });
    }

    // Mark as unsubscribed
    await db.newsletterSubscription.update({
      where: { id: subscription.id },
      data: {
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
