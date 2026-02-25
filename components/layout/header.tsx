"use client";

import { Menu, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout as logoutAction } from "@/lib/redux/slices/authSlice";
import apiClient from "@/lib/api/client";
import { BASE_URL } from "@/config/page";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMenuClick?: () => void;
}

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

export function Header({ title, breadcrumbs, onMenuClick }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Get the token from cookies
      const token = Cookies.get('token');
      
      if (token) {
        // Call the logout API
        try {
          const response = await fetch('https://development.truckmitr.com/api/dashboard/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          // Check if response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.status) {
              console.log(data.message);
            }
          }
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with logout even if API fails
        }
      }
      
    } finally {
      // Always clear all data and redirect, regardless of API response
      clearAllData();
      // Use replace to prevent back navigation
      window.location.replace("/auth/login");
    }
  };

  const clearAllData = () => {
    // Dispatch Redux logout action to clear auth state
    dispatch(logoutAction());
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear browser cache using Cache API
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  };

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

          {/* Logo - visible on mobile when sidebar is closed */}
          <div className="flex items-center gap-2 md:hidden">
            <img
              src="/icons/logotrick.png"
              alt="TruckMitr"
              className="h-8 w-auto object-contain"
            />
          </div>

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

        {/* Profile Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            >
              {employeeData?.photo_path ? (
                <div className="h-8 w-8 rounded-full overflow-hidden bg-white border-2 border-gray-200">
                  <Image
                    src={`${BASE_URL}/storage/app/public/${employeeData.photo_path}`}
                    alt={employeeData.full_name || "Profile"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold">${getInitials(employeeData?.full_name || "")}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(employeeData?.full_name || "")}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{employeeData?.full_name || "Loading..."}</p>
                  <p className="text-xs text-gray-500">{employeeData?.email || ""}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
