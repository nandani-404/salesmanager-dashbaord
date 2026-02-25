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
  ChevronLeft,
  Users,
  PackagePlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api/client";
import { BASE_URL } from "@/config/page";
import Image from "next/image";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "My Shippers", href: "/shippers" },
  { icon: Users, label: "My Truckers", href: "/truckers" },
  { icon: PackagePlus, label: "Shipment", href: "/shipment" },
  { icon: CheckSquare, label: "Accepted Loads", href: "/loads" },
  { icon: Navigation, label: "In Transit", href: "/in-transit" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: User, label: "Profile", href: "/profile" },
];

interface EmployeeData {
  id: number;
  emp_id: string;
  full_name: string;
  email: string;
  mobile: string;
  department_id: string;
  department_name: string;
  designation: string;
  doj: string;
  work_location: string;
  current_address: string;
  city: string;
  state_id: string;
  state_name: string;
  pin: string;
  photo_path?: string;
  photo_url?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ isOpen, onClose, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await apiClient.get("/api/dashboard/employees/15");
        if (response.data && response.data.status && response.data.data) {
          setEmployeeData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    fetchEmployeeData();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
              {employeeData?.photo_path ? (
                <div className="h-10 w-10 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                  <Image
                    src={`${BASE_URL}/storage/app/public/${employeeData.photo_path}`}
                    alt={employeeData.full_name || "Profile"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-sm font-bold">${getInitials(employeeData?.full_name || "")}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {getInitials(employeeData?.full_name || "")}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {employeeData?.full_name || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 truncate">{employeeData?.designation || "Sales Manager"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
