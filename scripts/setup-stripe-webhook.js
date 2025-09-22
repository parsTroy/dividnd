#!/usr/bin/env node

/**
 * Script to help set up Stripe webhook for production
 * Run this after deploying to Vercel
 */

// @ts-nocheck
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createWebhook() {
  try {
    const webhook = await stripe.webhooks.create({
      url: 'https://www.dividnd.com/api/stripe/webhook',
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
      ],
    });

    console.log('✅ Webhook created successfully!');
    console.log('Webhook ID:', webhook.id);
    console.log('Webhook Secret:', webhook.secret);
    console.log('\n📝 Add this to your Vercel environment variables:');
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
  } catch (error) {
    console.error('❌ Error creating webhook:', error.message);
  }
}

createWebhook();
