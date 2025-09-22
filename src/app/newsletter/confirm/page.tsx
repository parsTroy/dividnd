'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NewsletterConfirmPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-confirmed'>('loading');
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await fetch(`/api/newsletter/confirm?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          if (data.alreadyConfirmed) {
            setStatus('already-confirmed');
            setMessage('Your email is already confirmed!');
          } else {
            setStatus('success');
            setMessage(data.message);
            setDiscountCode(data.discountCode);
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to confirm subscription');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to confirm subscription');
      }
    };

    confirmSubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Confirming your subscription...</h1>
              <p className="text-gray-600">Please wait while we confirm your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Dividnd! 🎉</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              
              {discountCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Your Special Discount</h3>
                  <p className="text-green-700 mb-3">Get 15% off your first year of Premium!</p>
                  <div className="bg-white border border-green-300 rounded px-4 py-2 mb-3">
                    <code className="text-lg font-bold text-gray-900">{discountCode}</code>
                  </div>
                  <p className="text-sm text-green-600">Valid for 30 days</p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
                >
                  Upgrade to Premium
                </Link>
                <Link
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors block"
                >
                  Continue to App
                </Link>
              </div>
            </>
          )}

          {status === 'already-confirmed' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Already Confirmed!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Continue to App
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Confirmation Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
                >
                  Go Home
                </Link>
                <Link
                  href="/contact"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors block"
                >
                  Contact Support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
