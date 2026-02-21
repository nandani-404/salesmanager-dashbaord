"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMenuClick?: () => void;
}

export function Header({ title, breadcrumbs, onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Breadcrumbs / Title */}
          <div>
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    <span
                      className={
                        index === breadcrumbs.length - 1
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      {crumb.label}
                    </span>
                  </div>
                ))}
              </nav>
            ) : (
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            )}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
