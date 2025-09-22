import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features - Dividnd",
  description: "Discover all the powerful features of Dividnd dividend portfolio tracking platform",
};

export default function FeaturesPage() {
  const features = [
    {
      title: "Portfolio Tracking",
      description: "Track multiple portfolios with real-time stock prices and comprehensive analytics.",
      icon: "📊",
      details: [
        "Real-time stock price updates",
        "Multiple portfolio management",
        "Purchase price tracking",
        "Current market value calculations"
      ]
    },
    {
      title: "Dividend Analytics",
      description: "Comprehensive dividend tracking and income projections for informed investment decisions.",
      icon: "💰",
      details: [
        "Annual dividend income tracking",
        "Dividend yield calculations",
        "Monthly income projections",
        "Historical dividend data"
      ]
    },
    {
      title: "Goal Setting",
      description: "Set and track monthly dividend income goals with progress monitoring.",
      icon: "🎯",
      details: [
        "Monthly dividend income goals",
        "Progress tracking and visualization",
        "Goal achievement analytics",
        "Automatic annual calculations"
      ]
    },
    {
      title: "Stock Suggestions",
      description: "AI-powered suggestions for high dividend yield stocks to help achieve your goals.",
      icon: "🤖",
      details: [
        "High dividend yield stock recommendations",
        "Shares needed calculations",
        "Investment efficiency analysis",
        "Portfolio diversification insights"
      ]
    },
    {
      title: "Future Value Calculator",
      description: "Project your portfolio's growth with compound interest calculations and regular deposits.",
      icon: "📈",
      details: [
        "Compound interest calculations",
        "Regular deposit scenarios",
        "Time-based projections",
        "Interactive growth charts"
      ]
    },
    {
      title: "Advanced Analytics",
      description: "Deep insights into your portfolio performance with detailed charts and metrics.",
      icon: "📋",
      details: [
        "Portfolio allocation pie charts",
        "Position performance analysis",
        "Dividend income timeline",
        "Total return calculations"
      ]
    },
    {
      title: "Real-time Data",
      description: "Access to live market data from professional financial data providers.",
      icon: "⚡",
      details: [
        "Alpha Vantage integration",
        "Finnhub backup data",
        "24-hour data caching",
        "Market hours updates"
      ]
    },
    {
      title: "Secure & Private",
      description: "Bank-level security with encrypted data storage and privacy protection.",
      icon: "🔒",
      details: [
        "End-to-end encryption",
        "Secure cloud hosting",
        "Privacy-first design",
        "GDPR compliance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Powerful Features for Dividend Investors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to track, analyze, and optimize your dividend portfolio in one comprehensive platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who trust <span className="text-[var(--color-primary-600)]">Dividnd</span> to track their dividend portfolios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose <span className="text-[var(--color-primary-600)]">Dividnd</span>?</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Data</h4>
                  <p className="text-gray-600">Get live stock prices and dividend information from professional data providers.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h4>
                  <p className="text-gray-600">Intuitive interface designed for both beginners and experienced investors.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h4>
                  <p className="text-gray-600">Your data is protected with bank-level security and never shared with third parties.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Individual dividend investors</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Retirement planning</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Passive income tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Portfolio diversification</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Long-term wealth building</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Financial goal setting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
