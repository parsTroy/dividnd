import Link from "next/link";

interface LandingPageProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function LandingPage({ isAuthenticated, userName }: LandingPageProps) {
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="heading-1">
                Welcome back, <span className="text-[var(--color-primary-600)]">{userName}</span>
              </h1>
              <p className="mt-6 body-large max-w-3xl mx-auto">
                Ready to track your dividend investments and build wealth through passive income?
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/portfolio"
                className="card group p-8 hover:border-[var(--color-primary-300)]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary-200)] transition-colors">
                    <svg className="w-6 h-6 text-[var(--color-primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="heading-4 mb-3">View Portfolio</h3>
                <p className="body-medium">
                  Track your stock positions, monitor performance, and analyze your dividend income.
                </p>
              </Link>

              <Link
                href="/portfolio"
                className="card group p-8 hover:border-[var(--color-success-300)]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[var(--color-success-100)] rounded-lg flex items-center justify-center group-hover:bg-[var(--color-success-200)] transition-colors">
                    <svg className="w-6 h-6 text-[var(--color-success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <h3 className="heading-4 mb-3">Add Positions</h3>
                <p className="body-medium">
                  Add new stock positions and start building your dividend portfolio.
                </p>
              </Link>

              <Link
                href="/calculator"
                className="card group p-8 hover:border-[var(--color-financial-accent)]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-[var(--color-financial-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="heading-4 mb-3">Future Value Calculator</h3>
                <p className="body-medium">
                  Project your portfolio's growth with compound interest calculations.
                </p>
              </Link>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/api/auth/signout"
                className="btn-secondary"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="heading-1">
              Build Wealth Through
              <span className="text-[var(--color-primary-600)]"> Dividend Investing</span>
            </h1>
            <p className="mt-6 body-large max-w-3xl mx-auto">
              Track your dividend portfolio, calculate expected income, and maximize your passive income investments with professional-grade analytics.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="btn-primary px-8 py-4"
              >
                Get Started Free
              </Link>
              <Link
                href="/features"
                className="btn-secondary px-8 py-4"
              >
                View Features
              </Link>
            </div>
            <p className="mt-4 caption">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2">
              Everything you need to track dividend investments
            </h2>
            <p className="mt-4 body-large">
              Professional tools designed specifically for dividend investors
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-8">
              <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Portfolio Tracking</h3>
              <p className="body-medium">
                Monitor your stock positions, track performance, and calculate unrealized gains and losses in real-time.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 bg-[var(--color-success-100)] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Dividend Analytics</h3>
              <p className="body-medium">
                Calculate expected annual dividend income, track dividend yields, and set income goals for your portfolio.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-financial-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Performance Insights</h3>
              <p className="body-medium">
                Get detailed analytics with beautiful charts and visualizations to understand your portfolio performance.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 bg-[var(--color-warning-100)] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-financial-highlight)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Stock Suggestions</h3>
              <p className="body-medium">
                Discover high dividend yield stocks and get recommendations to help achieve your income goals.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Future Value Calculator</h3>
              <p className="body-medium">
                Project your portfolio's growth with compound interest calculations and regular deposit scenarios.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 bg-[var(--color-error-100)] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-4">Secure & Private</h3>
              <p className="body-medium">
                Bank-level security with encrypted data storage. Your financial information is always protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--color-primary-600)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="heading-2 text-white">
              Ready to start building wealth through dividends?
            </h2>
            <p className="mt-4 body-large text-[var(--color-primary-100)]">
              Join thousands of investors who trust Dividnd to track their dividend portfolios
            </p>
            <div className="mt-8">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-[var(--color-primary-600)] bg-white hover:bg-gray-50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
            <p className="mt-4 caption text-[var(--color-primary-200)]">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
