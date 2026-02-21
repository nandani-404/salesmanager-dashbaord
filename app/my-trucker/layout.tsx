"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";

export default function MyTruckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDetailPage = pathname !== "/my-trucker";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Persistent Header - Shows you're in My Trucker section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Truckers</h2>
                {isDetailPage && (
                  <p className="text-xs text-gray-600">Viewing trucker details</p>
                )}
              </div>
            </div>
            {isDetailPage && (
              <Link
                href="/my-trucker"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to All Truckers
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
