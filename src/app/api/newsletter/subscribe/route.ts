import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '~/server/db';
import { sendNewsletterConfirmationEmail } from '~/lib/email';
import { createNewsletterDiscountCode } from '~/lib/stripe-discounts';
import { randomBytes } from 'crypto';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if email already exists
    const existingSubscription = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.isConfirmed) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        );
      } else {
        // Resend confirmation email
        await sendNewsletterConfirmationEmail({
          email,
          confirmationToken: existingSubscription.confirmationToken,
          discountCode: existingSubscription.discountCode ?? 'NEWSLETTER15',
        });

        return NextResponse.json({
          message: 'Confirmation email sent. Please check your inbox.',
        });
      }
    }

    // Generate confirmation token and discount code
    const confirmationToken = randomBytes(32).toString('hex');
    const discountCode = await createNewsletterDiscountCode();

    // Create newsletter subscription
    const subscription = await db.newsletterSubscription.create({
      data: {
        email,
        confirmationToken,
        discountCode,
      },
    });

    // Send confirmation email
    await sendNewsletterConfirmationEmail({
      email,
      confirmationToken,
      discountCode,
    });

    return NextResponse.json({
      message: 'Please check your email to confirm your subscription and get your discount code!',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
