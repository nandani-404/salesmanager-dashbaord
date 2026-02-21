"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLoads } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Inline SVG icons (avoids lucide-react barrel-export HMR bug) ── */

function IndianRupeeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-2.235-2.794a1 1 0 0 0-.78-.382H15" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

/* ── Data ── */

const revenueData = [
  { month: "Jun", revenue: 3500000 },
  { month: "Jul", revenue: 4100000 },
  { month: "Aug", revenue: 3800000 },
  { month: "Sep", revenue: 4800000 },
  { month: "Oct", revenue: 4600000 },
  { month: "Nov", revenue: 5300000 },
];

const routeData = [
  { route: "MUM-DEL", loads: 45 },
  { route: "BLR-HYD", loads: 38 },
  { route: "KOL-PUN", loads: 32 },
  { route: "CHE-BLR", loads: 28 },
];

const recentShippers = [
  { id: "1", name: "Bharat Logistics", company: "Bharat Logistics Pvt Ltd", location: "Mumbai", date: "20 Nov 2024" },
  { id: "2", name: "Express Transport", company: "Express Transport Solutions", location: "Bangalore", date: "18 Nov 2024" },
  { id: "3", name: "North India Cargo", company: "North India Cargo Services", location: "Delhi", date: "15 Nov 2024" },
  { id: "4", name: "South Freight", company: "South Freight Co", location: "Chennai", date: "12 Nov 2024" },
  { id: "5", name: "Western Logistics", company: "Western Logistics Hub", location: "Pune", date: "10 Nov 2024" },
];

const recentTruckers = [
  { id: "1", name: "Rajesh Kumar", company: "Kumar Transport", location: "Mumbai", date: "20 Nov 2024" },
  { id: "2", name: "Amit Sharma", company: "Sharma Logistics", location: "Bangalore", date: "19 Nov 2024" },
  { id: "3", name: "Suresh Patel", company: "Patel Freight", location: "Kolkata", date: "17 Nov 2024" },
  { id: "4", name: "Vikram Singh", company: "Singh Express", location: "Delhi", date: "14 Nov 2024" },
  { id: "5", name: "Arjun Mehta", company: "Mehta Transport", location: "Ahmedabad", date: "11 Nov 2024" },
];

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(5300000),
      change: "↑ 12.5% from last month",
      changeType: "positive" as const,
      icon: IndianRupeeIcon,
    },
    {
      title: "Active Loads",
      value: "24",
      change: "8 pending assignment",
      changeType: "neutral" as const,
      icon: PackageIcon,
    },
    {
      title: "Completed Deliveries",
      value: "156",
      change: "↑ 8% from last month",
      changeType: "positive" as const,
      icon: CheckCircleIcon,
    },
    {
      title: "Avg Delivery Time",
      value: "3.2 days",
      change: "↓ 0.3 days improvement",
      changeType: "positive" as const,
      icon: ClockIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="route" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="loads" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Onboarding Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Shippers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-gray-50 bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100/50">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Recent Shippers</CardTitle>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Growth</p>
                </div>
              </div>
              <Link href="/shippers" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all flex items-center gap-1">
                View All
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {recentShippers.map((shipper, index) => (
                  <motion.div
                    key={shipper.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(239, 246, 255, 0.4)" }}
                    className="flex items-center justify-between group p-3 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600 group-hover:shadow-sm transition-all">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                          {shipper.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {shipper.location}
                          </span>
                          <span className="text-[10px] text-gray-300">•</span>
                          <span className="text-[11px] font-medium text-blue-500">{shipper.date}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/shippers/${shipper.id}`}
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-blue-600 text-gray-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Truckers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-gray-50 bg-gradient-to-r from-emerald-50/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100/50">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Recent Truckers</CardTitle>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Partners</p>
                </div>
              </div>
              <Link href="/truckers" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-all flex items-center gap-1">
                View All
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {recentTruckers.map((trucker, index) => (
                  <motion.div
                    key={trucker.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: -5, backgroundColor: "rgba(236, 253, 245, 0.4)" }}
                    className="flex items-center justify-between group p-3 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:border-emerald-200 group-hover:text-emerald-600 group-hover:shadow-sm transition-all">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-800 leading-tight group-hover:text-emerald-600 transition-colors">
                          {trucker.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <TruckIcon className="h-2.5 w-2.5" />
                            {trucker.location}
                          </span>
                          <span className="text-[10px] text-gray-300">•</span>
                          <span className="text-[11px] font-medium text-emerald-500">{trucker.date}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/truckers/${trucker.id}`}
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-emerald-600 text-gray-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Load Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLoads.slice(0, 5).map((load) => (
              <div
                key={load.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-700">{load.loadNumber}</p>
                    <Badge variant={load.status}>{load.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {load.origin.city}, {load.origin.state} → {load.destination.city},{" "}
                    {load.destination.state}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Pickup: {formatDate(load.pickupDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    {formatCurrency(load.revenue)}
                  </p>
                  <p className="text-sm text-gray-600">{load.shipperName}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
