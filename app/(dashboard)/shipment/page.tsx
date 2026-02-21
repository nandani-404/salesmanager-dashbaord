"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Calendar,
  Eye,
  Users,
  TrendingUp,
  Truck,
  ArrowRight,
  Grid3x3,
  List,
  Filter,
  Search,
  Sparkles,
  Clock,
  FileText,
  CheckCircle,
  UserCheck,
  AlertCircle,
  Navigation,
  Fuel,
  AlertTriangle,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/config/page";

// --- API Interfaces ---
interface APILoad {
  id: string;
  user_id: string;
  shipper_name: string;
  load_id: string;
  origin_location: string;
  destination_location: string;
  price: string;
  status: string;
  load_qty: string;
  pickup_date: string | null;
  load_time: string | null;
  material_name: string;
  created_at: string;
  total_bids: string;
}

interface LoadsResponse {
  total_loads: number;
  per_page: number;
  current_page: number;
  last_page: number;
  loads: APILoad[];
}

export default function ShipmentPage() {
  const router = useRouter();
  const [data, setData] = useState<LoadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "in-transit" | "delivered">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Loads
  useEffect(() => {
    const fetchLoads = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<LoadsResponse>(`${API_ENDPOINTS.dashboard.shipmentsLoads}?page=${currentPage}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch loads");
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, [currentPage]);

  // Map API data to UI structure
  const mappedLoads = useMemo(() => {
    if (!data) return [];
    return data.loads.map((load) => {
      // Map statuses
      let uiStatus: "pending" | "confirmed" | "in-transit" | "delivered" = "pending";
      if (load.status === "accepted") uiStatus = "confirmed";
      else if (load.status === "in-transit") uiStatus = "in-transit";
      else if (load.status === "delivered") uiStatus = "delivered";
      else uiStatus = "pending"; // default for open-load or others

      // Simple location parser (City, State)
      const parseLocation = (loc: string) => {
        const parts = loc.split(",").map(p => p.trim());
        return {
          city: parts[0] || "N/A",
          state: parts[1] || "N/A",
          address: loc
        };
      };

      return {
        id: load.id,
        loadNumber: load.load_id.replace("TMLD", ""),
        fullLoadId: load.load_id,
        shipperName: load.shipper_name,
        origin: parseLocation(load.origin_location),
        destination: parseLocation(load.destination_location),
        rawOrigin: load.origin_location,
        rawDestination: load.destination_location,
        revenue: parseFloat(load.price),
        rawPrice: load.price,
        status: uiStatus,
        rawStatus: load.status,
        cargo: {
          type: load.material_name,
          weight: parseFloat(load.load_qty) * 1000
        },
        rawLoadQty: load.load_qty,
        pickupDate: load.pickup_date ? new Date(load.pickup_date) : new Date(load.created_at),
        rawPickupDate: load.pickup_date || "N/A",
        pickupTime: load.load_time || "N/A",
        rawPickupTime: load.load_time || "N/A",
        rawCreatedAt: load.created_at,
        bidsCount: parseInt(load.total_bids)
      };
    });
  }, [data]);

  // Filter loads
  const filteredLoads = useMemo(() => {
    return mappedLoads.filter((load) => {
      const matchesSearch =
        load.fullLoadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.shipperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.rawOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.rawDestination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterStatus === "all" || load.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus, mappedLoads]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    if (!data) return { total: 0, pending: 0, confirmed: 0, inTransit: 0 };
    return {
      total: data.total_loads,
      pending: data.loads.filter(l => l.status === "open-load").length,
      confirmed: data.loads.filter(l => l.status === "accepted").length,
      inTransit: data.loads.filter(l => l.status === "in-transit").length,
    };
  }, [data]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header (Always Visible) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipment Loads</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
              <Package className="h-3 w-3" /> Loads
            </div>
            <span className="text-gray-300">•</span>
            <p className="text-gray-500 text-sm font-medium">Track, manage & monitor all your loads</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Loads Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-[140px]"
        >
          <Card className="h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Package className="h-8 w-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Total</span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-white/20 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold mb-1">{stats.total}</p>
              )}
              <p className="text-sm opacity-90">Total Loads</p>
            </div>
          </Card>
        </motion.div>

        {/* Pending Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="h-[140px] perspective-1000"
        >
          <Card className="h-full bg-gradient-to-br from-amber-400 to-amber-500 text-white border-0 shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Pending</span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-white/20 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold mb-1">{stats.pending}</p>
              )}
              <p className="text-sm opacity-90">Pending Loads</p>
            </div>
          </Card>
        </motion.div>

        {/* Confirmed Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[140px]"
        >
          <Card className="h-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <UserCheck className="h-8 w-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Confirmed</span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-white/20 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold mb-1">{stats.confirmed}</p>
              )}
              <p className="text-sm opacity-90">Confirmed Loads</p>
            </div>
          </Card>
        </motion.div>

        {/* Transit Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="h-[140px]"
        >
          <Card className="h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Navigation className="h-8 w-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Transit</span>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-white/20 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold mb-1">{stats.inTransit}</p>
              )}
              <p className="text-sm opacity-90">In-Transit Loads</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-500 max-w-md">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 hover:bg-blue-700 rounded-xl px-8 h-12 font-bold">
            Retry Connection
          </Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Syncing loads from database...</p>
        </div>
      ) : (
        <>
          {/* Search Bar with View Toggle and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by load number, shipper, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-6 rounded-xl shadow-sm ${showFilters
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
                  }`}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>

              {/* Filter Dropdown */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-10"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Filter by Status
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "all"
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      All Loads
                    </button>
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "pending"
                        ? "bg-yellow-50 text-yellow-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilterStatus("confirmed")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Confirmed
                    </button>
                    <button
                      onClick={() => setFilterStatus("in-transit")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "in-transit"
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      In Transit
                    </button>
                    <button
                      onClick={() => setFilterStatus("delivered")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "delivered"
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Delivered
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredLoads.length}</span> of{" "}
              <span className="font-semibold text-gray-800">{stats.total}</span> loads
            </p>
          </div>

          {/* Loads Grid/List */}
          <div className={viewMode === "grid" ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredLoads.map((load, index) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white border-l-4 ${load.status === "pending"
                  ? "border-l-amber-400"
                  : load.status === "confirmed"
                    ? "border-l-emerald-500"
                    : load.status === "in-transit"
                      ? "border-l-blue-500"
                      : "border-l-green-500"
                  }`}>
                  <div className={viewMode === "grid" ? "p-5" : "p-6"}>
                    {viewMode === "grid" ? (
                      /* Grid View */
                      <>
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${load.status === "pending"
                              ? "bg-amber-50"
                              : load.status === "confirmed"
                                ? "bg-emerald-50"
                                : load.status === "in-transit"
                                  ? "bg-blue-50"
                                  : "bg-green-50"
                              }`}>
                              <Truck className={`h-5 w-5 ${load.status === "pending"
                                ? "text-amber-500"
                                : load.status === "confirmed"
                                  ? "text-emerald-500"
                                  : load.status === "in-transit"
                                    ? "text-blue-500"
                                    : "text-green-500"
                                }`} />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-gray-900">{load.fullLoadId}</h3>
                              <p className="text-xs text-gray-500 truncate max-w-[140px]">{load.shipperName}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${load.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : load.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : load.status === "in-transit"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                          >
                            {load.rawStatus}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {load.rawCreatedAt}
                        </p>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-start gap-2 p-2.5 bg-blue-50/70 rounded-lg">
                            <MapPin className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-800 leading-snug">{load.rawOrigin}</p>
                          </div>
                          <div className="flex items-start gap-2 p-2.5 bg-green-50/70 rounded-lg">
                            <MapPin className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-800 leading-snug">{load.rawDestination}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 p-2.5 bg-gray-50 rounded-lg pb-3 border-b border-gray-200">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pickup</p>
                            <p className="text-sm font-semibold text-gray-900">{load.rawPickupTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
                            <p className="text-lg font-bold text-blue-600">₹{load.rawPrice}</p>
                          </div>
                          <div className="text-center">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
                              <Users className="h-3 w-3" />
                              <span className="text-xs font-bold">{load.bidsCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/shipment/${load.id}`)}
                            className="text-xs h-9 rounded-lg"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/shipment/${load.id}/bids`)}
                            className="bg-blue-600 hover:bg-blue-700 text-xs h-9 rounded-lg"
                          >
                            <Users className="mr-1 h-3 w-3" />
                            Bids
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Phone className="mr-1 h-3 w-3" />
                            Call
                          </Button>
                        </div>
                      </>
                    ) : (
                      /* List View */
                      <>
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${load.status === "pending"
                              ? "bg-amber-50"
                              : load.status === "confirmed"
                                ? "bg-emerald-50"
                                : load.status === "in-transit"
                                  ? "bg-blue-50"
                                  : "bg-green-50"
                              }`}>
                              <Truck className={`h-6 w-6 ${load.status === "pending"
                                ? "text-amber-500"
                                : load.status === "confirmed"
                                  ? "text-emerald-500"
                                  : load.status === "in-transit"
                                    ? "text-blue-500"
                                    : "text-green-500"
                                }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h3 className="text-lg font-bold text-gray-900">{load.fullLoadId}</h3>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${load.status === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : load.status === "confirmed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : load.status === "in-transit"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                >
                                  {load.rawStatus}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {load.shipperName} <span className="text-gray-300 mx-1">•</span>
                                <span className="text-xs text-gray-400">{load.rawCreatedAt}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Price</p>
                            <p className="text-2xl font-bold text-blue-600 mb-1">₹{load.rawPrice}</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
                              <Users className="h-4 w-4" />
                              <span className="text-sm font-bold">{load.bidsCount} Bids</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <div className="flex gap-3 p-3 bg-blue-50/70 rounded-xl">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-blue-600 font-medium mb-0.5">Pickup Location</p>
                              <p className="font-semibold text-gray-900 text-sm leading-relaxed">
                                {load.rawOrigin}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 p-3 bg-green-50/70 rounded-xl">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-green-600 font-medium mb-0.5">Delivery Location</p>
                              <p className="font-semibold text-gray-900 text-sm leading-relaxed">
                                {load.rawDestination}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-xl pb-3 border-b border-gray-200">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Material Type</p>
                            <p className="font-semibold text-gray-900 text-sm">{load.cargo.type}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Qty</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {load.rawLoadQty}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Pickup Time</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {load.rawPickupTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Pickup Date</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {load.rawPickupDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/shipment/${load.id}`)}
                            className="flex-1 rounded-lg h-10"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/shipment/${load.id}/bids`)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg h-10"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Bids
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredLoads.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No loads found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </motion.div>
          )}

          {/* Pagination Section (Matched to Truckers Page) */}
          {data && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
              <div className="text-sm text-[#64748b]">
                Showing <span className="font-semibold">{(currentPage - 1) * data.per_page + 1}</span> to <span className="font-semibold">{Math.min(currentPage * data.per_page, data.total_loads)}</span> of <span className="font-semibold">{data.total_loads}</span> results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-sm font-medium text-gray-500 px-4">
                  Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{data.last_page}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(data.last_page, p + 1))}
                  disabled={currentPage === data.last_page}
                  className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(data.last_page)}
                  disabled={currentPage === data.last_page}
                  className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
