"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  CheckSquare,
  Package,
  Truck,
  Navigation,
  BarChart3,
  Settings,
  ChevronLeft,
  Users,
  PackagePlus,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "My Shippers", href: "/shippers" },
  { icon: Users, label: "My Truckers", href: "/truckers" },
  { icon: PackagePlus, label: "Shipment", href: "/shipment" },
  { icon: CheckSquare, label: "Accepted Loads", href: "/loads" },
  { icon: Navigation, label: "In Transit", href: "/in-transit" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ isOpen, onClose, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-72",
        // Mobile styles
        "transform md:translate-x-0",
        !isOpen && "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img
                src="/icons/logotrick.png"
                alt="TruckMitr"
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 text-gray-600 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden rounded-lg p-1.5 hover:bg-gray-100 transition-colors ml-auto"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Use startsWith for nested routes, but handle dashboard separately
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()} // Close sidebar on navigation (mobile)
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-800",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!collapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Rahul Verma
                </p>
                <p className="text-xs text-gray-500 truncate">Sales Manager</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
