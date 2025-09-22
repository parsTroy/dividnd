import { Resend } from 'resend';
import { env } from '~/env.js';

const resend = new Resend(env.RESEND_API_KEY);

export interface NewsletterConfirmationEmailProps {
  email: string;
  confirmationToken: string;
  discountCode: string;
}

export interface NewsletterWelcomeEmailProps {
  email: string;
  discountCode: string;
}

export async function sendNewsletterConfirmationEmail({
  email,
  confirmationToken,
  discountCode,
}: NewsletterConfirmationEmailProps) {
  const confirmationUrl = `${process.env.NEXTAUTH_URL}/newsletter/confirm?token=${confirmationToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Dividnd <newsletter@dividnd.com>',
      to: [email],
      subject: 'Confirm your newsletter subscription - Get 15% off Premium!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Dividnd!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Confirm your subscription to get started</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Almost there!</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for subscribing to our newsletter! We're excited to share dividend investing insights, 
              market updates, and portfolio tips with you.
            </p>
            
            <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 Special Offer!</h3>
              <p style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                Get 15% off your first year of Premium!
              </p>
              <div style="background: white; border-radius: 4px; padding: 10px; margin: 10px 0;">
                <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #333;">
                  Code: ${discountCode}
                </p>
              </div>
              <p style="color: #2e7d32; margin: 10px 0 0 0; font-size: 14px;">
                Valid for 30 days after confirmation
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Confirm Subscription
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #667eea;">${confirmationUrl}</a>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Dividnd. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">
              <a href="${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?token=${confirmationToken}" 
                 style="color: #ccc;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending newsletter confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }

    return data;
  } catch (error) {
    console.error('Newsletter confirmation email error:', error);
    throw error;
  }
}

export async function sendNewsletterWelcomeEmail({
  email,
  discountCode,
}: NewsletterWelcomeEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Dividnd <newsletter@dividnd.com>',
      to: [email],
      subject: 'Welcome to Dividnd Newsletter! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Dividnd!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You're all set to receive our newsletter</p>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Thank you for subscribing! 🎉</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              You're now part of our community of dividend investors. We'll send you weekly insights, 
              market updates, and exclusive tips to help you build a successful dividend portfolio.
            </p>
            
            <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #2e7d32; margin: 0 0 10px 0;">Your Special Discount</h3>
              <p style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                Get 15% off your first year of Premium!
              </p>
              <div style="background: white; border-radius: 4px; padding: 10px; margin: 10px 0;">
                <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #333;">
                  Code: ${discountCode}
                </p>
              </div>
              <div style="margin: 15px 0;">
                <a href="${process.env.NEXTAUTH_URL}/pricing" 
                   style="background: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Upgrade to Premium
                </a>
              </div>
              <p style="color: #2e7d32; margin: 10px 0 0 0; font-size: 14px;">
                Valid for 30 days
              </p>
            </div>
            
            <h3 style="color: #333; margin: 20px 0 10px 0;">What to expect:</h3>
            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Weekly dividend market insights</li>
              <li>Portfolio optimization tips</li>
              <li>Exclusive stock analysis</li>
              <li>Early access to new features</li>
            </ul>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Dividnd. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">
              <a href="${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}" 
                 style="color: #ccc;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending newsletter welcome email:', error);
      throw new Error('Failed to send welcome email');
    }

    return data;
  } catch (error) {
    console.error('Newsletter welcome email error:', error);
    throw error;
  }
}
