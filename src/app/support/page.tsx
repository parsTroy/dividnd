import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support & Help Center - Dividnd",
  description: "Get help with Dividnd portfolio tracking platform",
};

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I add stocks to my portfolio?",
      answer: "Click the 'Add Position' button on your portfolio dashboard. Enter the stock ticker symbol, and we'll automatically fetch the current price and dividend information. Fill in your purchase details and save."
    },
    {
      question: "How accurate is the stock data?",
      answer: "We use real-time data from Alpha Vantage and Finnhub, which are professional financial data providers. Stock prices are updated throughout market hours, and dividend information is sourced from official company filings."
    },
    {
      question: "Can I track multiple portfolios?",
      answer: "Yes! You can create multiple portfolios to track different investment strategies. Set one as your main portfolio to display by default on the dashboard."
    },
    {
      question: "How do dividend goals work?",
      answer: "Set a monthly dividend income goal for any portfolio. We'll track your progress and suggest high-yield stocks to help you reach your target. The system calculates how many shares you need to buy."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption, secure cloud hosting, and never share your personal information. All data is encrypted in transit and at rest."
    },
    {
      question: "Can I export my portfolio data?",
      answer: "Export functionality is coming soon! We're working on CSV and PDF export options for your portfolio data and reports."
    },
    {
      question: "What's the Future Value Calculator?",
      answer: "The calculator helps you project your portfolio's growth over time using compound interest calculations. Input your current value, expected return, and regular deposits to see potential future values."
    },
    {
      question: "How do stock suggestions work?",
      answer: "Our algorithm analyzes cached stock data to find high dividend yield stocks not already in your portfolio. It calculates how many shares you'd need to buy to reach your dividend income goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions and get the most out of your Dividnd experience
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">New to Dividnd? Learn the basics of portfolio tracking and dividend analysis.</p>
            <Link href="#getting-started" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account & Billing</h3>
            <p className="text-gray-600 mb-4">Manage your account settings, subscription, and billing information.</p>
            <Link href="#account" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Features & Tools</h3>
            <p className="text-gray-600 mb-4">Explore advanced features like calculators, analytics, and stock suggestions.</p>
            <Link href="#features" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-12">
          <div className="px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Still Need Help?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:support@dividnd.com" className="text-blue-600 hover:text-blue-700">
                      support@dividnd.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Response time: Within 24 hours</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/contact" className="block text-blue-600 hover:text-blue-700">
                    Contact Form
                  </Link>
                  <Link href="/terms" className="block text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="block text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
