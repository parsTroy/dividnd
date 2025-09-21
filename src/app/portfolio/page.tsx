import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { PortfolioDashboard } from "./_components/portfolio-dashboard";

export default async function PortfolioPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600">Track your dividend investments and portfolio performance</p>
        </div>
        
        <PortfolioDashboard />
      </div>
    </div>
  );
}
