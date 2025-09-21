"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navigation() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-purple-600">Dividnd</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/portfolio"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Portfolio
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
