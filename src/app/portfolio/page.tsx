import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { PortfolioDashboard } from "./_components/portfolio-dashboard";

export default async function PortfolioPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
        <p className="text-gray-600">Track your dividend investments and portfolio performance</p>
      </div>
      
      <PortfolioDashboard />
    </div>
  );
}
