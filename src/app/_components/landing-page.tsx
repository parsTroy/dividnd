import Link from "next/link";

interface LandingPageProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function LandingPage({ isAuthenticated, userName }: LandingPageProps) {
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Welcome to <span className="text-[hsl(280,100%,70%)]">Dividnd</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Your personal dividend stock portfolio tracker
            </p>
            <p className="mt-2 text-lg text-gray-400">
              Hello, {userName}! Ready to track your dividend investments?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              href="/portfolio"
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6 hover:bg-white/20 transition-colors"
            >
              <h3 className="text-2xl font-bold">📊 View Portfolio</h3>
              <div className="text-lg">
                Track your stock positions, calculate P&L, and monitor dividend income.
              </div>
            </Link>
            
            <Link
              href="/portfolio"
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6 hover:bg-white/20 transition-colors"
            >
              <h3 className="text-2xl font-bold">💰 Add Positions</h3>
              <div className="text-lg">
                Add new stock positions and track your dividend investments.
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/api/auth/signout"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Dividnd</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Track your dividend stock portfolio and maximize your passive income
          </p>
          <p className="mt-2 text-lg text-gray-400">
            Built for dividend investors who want to track their portfolio performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6">
            <h3 className="text-2xl font-bold">📊 Portfolio Tracking</h3>
            <div className="text-lg">
              Track your stock positions, monitor performance, and calculate unrealized gains/losses.
            </div>
          </div>
          
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6">
            <h3 className="text-2xl font-bold">💰 Dividend Income</h3>
            <div className="text-lg">
              Calculate expected annual dividend income and track dividend yield across your portfolio.
            </div>
          </div>
          
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6">
            <h3 className="text-2xl font-bold">📈 Performance Analytics</h3>
            <div className="text-lg">
              Get insights into your portfolio performance with detailed analytics and reporting.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-2xl text-white">
            Ready to start tracking your dividend investments?
          </p>
          <Link
            href="/api/auth/signin"
            className="rounded-full bg-green-600 px-10 py-3 font-semibold no-underline transition hover:bg-green-700"
          >
            Get Started with Google
          </Link>
          <p className="text-sm text-gray-400">
            Free to use • No credit card required • Secure authentication
          </p>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Features Coming Soon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>🔍 Stock discovery and recommendations</div>
            <div>📊 Advanced portfolio analytics</div>
            <div>💹 Real-time stock price updates</div>
            <div>📅 Dividend calendar and history</div>
            <div>🎯 Investment goal tracking</div>
            <div>📱 Mobile-optimized interface</div>
          </div>
        </div>
      </div>
    </div>
  );
}
