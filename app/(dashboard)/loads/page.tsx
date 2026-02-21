"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLoads } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Filter, Download, Eye, Edit, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLoads = mockLoads.filter((load) => {
    const matchesSearch =
      load.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.shipperName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || load.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Accepted Loads</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all accepted freight loads
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by load number or shipper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Load ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Shipper
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Trucker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Final Shipper Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Final Trucker Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLoads.map((load, index) => (
                <motion.tr
                  key={load.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-medium text-gray-700 text-base">{load.loadNumber}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-semibold text-gray-900 text-base">{load.shipperName}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-semibold text-gray-900 text-base">Kumar Transport Services</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span>
                        {load.origin.city}, {load.origin.state}
                      </span>
                      <span>→</span>
                      <span>
                        {load.destination.city}, {load.destination.state}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">{load.cargo.category}</div>
                      <div className="text-gray-600">{load.cargo.type}</div>
                      <div className="text-gray-500">{load.cargo.weight} lbs</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {formatDate(load.pickupDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={load.status}>{load.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600">
                    {formatCurrency(load.revenue)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-indigo-600">
                    {formatCurrency(load.revenue * 0.95)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/loads/${load.id}`)}
                        className="rounded p-1 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="rounded p-1 hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="rounded p-1 hover:bg-gray-100 transition-colors" title="Track">
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing {filteredLoads.length} of {mockLoads.length} loads
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

