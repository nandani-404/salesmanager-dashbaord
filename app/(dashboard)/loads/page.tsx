"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLoads } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Filter, Eye, Edit, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/config/page";

interface AcceptedLoad {
  load_id: number;
  company_name: string;
  transport_name: string;
  origin_location: string;
  destination_location: string;
  material_name: string;
  picup_date: string;
  trucker_price: number;
  shipper_price: number;
  commission: number;
}

export default function LoadsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loads, setLoads] = useState<AcceptedLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAcceptedLoads();
  }, []);

  const fetchAcceptedLoads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/dashboard/accepted-loads");
      
      if (response.data.status && response.data.data) {
        setLoads(response.data.data);
      } else {
        setError("Failed to fetch accepted loads");
      }
    } catch (err: any) {
      console.error("Error fetching accepted loads:", err);
      setError(err.response?.data?.message || "Failed to fetch accepted loads");
    } finally {
      setLoading(false);
    }
  };

  const filteredLoads = loads.filter((load) => {
    const matchesSearch =
      (load.load_id || "").toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (load.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (load.transport_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all";
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
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Loading accepted loads...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchAcceptedLoads} className="mt-4" variant="outline">
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Content */}
      {!loading && !error && (
        <>

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
                  Material
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
                  key={load.load_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-medium text-gray-700 text-base">{load.load_id}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-semibold text-gray-900 text-base">{load.company_name}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-semibold text-gray-900 text-base">{load.transport_name}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex items-center gap-1 text-sm text-gray-600 overflow-x-auto whitespace-nowrap max-h-12 overflow-y-hidden">
                      <span className="line-clamp-2 whitespace-normal">
                        {load.origin_location}
                      </span>
                      <span className="flex-shrink-0">→</span>
                      <span className="line-clamp-2 whitespace-normal">
                        {load.destination_location}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">{load.material_name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {load.picup_date ? formatDate(load.picup_date) : "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant="confirmed">Accepted</Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600">
                    {formatCurrency(load.shipper_price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-indigo-600">
                    {formatCurrency(load.trucker_price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/loads/${load.load_id}`)}
                        className="rounded p-1 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => router.push("/in-transit")}
                        className="rounded p-1 hover:bg-gray-100 transition-colors" 
                        title="Track"
                      >
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
            Showing {filteredLoads.length} of {loads.length} loads
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
      </>
      )}
    </div>
  );
}

