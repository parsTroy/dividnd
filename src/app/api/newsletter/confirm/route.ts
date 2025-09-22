import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { sendNewsletterWelcomeEmail } from '~/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      );
    }

    // Find subscription by token
    const subscription = await db.newsletterSubscription.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 404 }
      );
    }

    if (subscription.isConfirmed) {
      return NextResponse.json({
        message: 'Email already confirmed',
        alreadyConfirmed: true,
      });
    }

    // Confirm subscription
    await db.newsletterSubscription.update({
      where: { id: subscription.id },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });

    // Send welcome email with discount code
    await sendNewsletterWelcomeEmail({
      email: subscription.email,
      discountCode: subscription.discountCode || 'NEWSLETTER15',
    });

    return NextResponse.json({
      message: 'Email confirmed successfully! Welcome to our newsletter!',
      discountCode: subscription.discountCode,
    });
  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    );
  }
}
