import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { LandingPage } from "./_components/landing-page";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <LandingPage 
        isAuthenticated={!!session?.user}
        userName={session?.user?.name}
      />
    </HydrateClient>
  );
}
