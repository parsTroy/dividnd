import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { LandingPage } from "./_components/landing-page";

export default async function Home() {
  const session = await auth();

  // Redirect authenticated users directly to their portfolio dashboard
  if (session?.user) {
    redirect("/portfolio");
  }

  return (
    <HydrateClient>
      <LandingPage 
        isAuthenticated={false}
        userName={undefined}
      />
    </HydrateClient>
  );
}
