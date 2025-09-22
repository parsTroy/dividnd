import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { Navigation } from "./_components/navigation";
import Footer from "./_components/footer";

export const metadata: Metadata = {
  title: "Dividnd - Dividend Stock Portfolio Tracker",
  description: "Track your dividend stock portfolio, calculate expected income, and maximize your passive income investments.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
