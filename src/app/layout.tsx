import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { Navigation } from "./_components/navigation";
import Footer from "./_components/footer";

export const metadata: Metadata = {
  title: "Dividnd - Dividend Stock Portfolio Tracker",
  description: "Track your dividend stock portfolio, calculate expected income, and maximize your passive income investments.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Dividnd - Build Wealth Through Dividend Investing",
    description: "Professional dividend portfolio tracking with real-time analytics, income optimization, and advanced portfolio management tools.",
    url: "https://dividnd.com",
    siteName: "Dividnd",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dividnd - Dividend Investment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dividnd - Build Wealth Through Dividend Investing",
    description: "Professional dividend portfolio tracking with real-time analytics and income optimization.",
    images: ["/og-image.png"],
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
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
