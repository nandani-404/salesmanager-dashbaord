"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Filter, Grid3x3, List, Users, TrendingUp, Package, Eye,
  Activity, Check, ShieldCheck, Phone, AlertCircle, Loader2,
  ChevronRight, ChevronLeft, User, Mail, ChevronsLeft, ChevronsRight,
  MapPin, Building2, FileText, CreditCard, ArrowLeft,
  Briefcase, Globe, Landmark, LayoutDashboard, Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, BASE_URL } from "@/config/page";
import SearchModal from "@/components/search/search-modal";

// --- API Interfaces ---
interface Transporter {
  id: string;
  name: string;
  unique_id: string;
  transport_name: string | null;
  images: string | null;
  verified_trucker_shipper: string | null;
  total_vehicles: string;
  total_applied: string;
  total_bids: string;
  bid_count?: string;
  company_type?: string | null;
  company_type_name?: string | null;
  state?: string | null;
  state_name?: string | null;
}

interface TransportersResponse {
  total_transporters: number;
  total_active: number;
  total_inactive: number;
  total_pending: number;
  total_trucker: number;
  total_active_trucker: number;
  total_vehicle: number;
  total_applied: number;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  transporters: Transporter[];
}

interface TruckerDetail {
  id: string;
  name: string;
  email: string | null;
  mobile: string;
  address: string | null;
  unique_id: string;
  transport_name: string | null;
  verified_trucker_shipper: string | null;
  state_id: string | null;
  state_name: string | null;
  Fleet_Size: string | null;
  Year_of_Establishment: string | null;
  city: string | null;
  pincode: string | null;
  PAN_Image: string | null;
  GST_Certificate: string | null;
  PAN_Number: string | null;
  GST_Number: string | null;
  Registered_ID: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  bank_name: string | null;
  branch_name: string | null;
  ifsc_code: string | null;
  total_vehicles: string;
}

const IMAGE_URL = `${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}public/`;

export default function TruckersPage() {
  const router = useRouter();
  const [data, setData] = useState<TransportersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "pending">("all");
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Fetch Transporters
  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<TransportersResponse>(`${API_ENDPOINTS.dashboard.transporters}?page=${currentPage}`);
        console.log("Transporters API Response:", response.data);
        console.log("First transporter verified status:", response.data.transporters[0]?.verified_trucker_shipper);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch transporters");
      } finally {
        setLoading(false);
      }
    };

    fetchTransporters();
  }, [currentPage]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Dynamic search with local filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    // Use local filtering only
    if (data) {
      const localResults = data.transporters.filter((t) => {
        const name = t.name || "";
        const transportName = t.transport_name || "";
        const uniqueId = t.unique_id || "";
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query) ||
               transportName.toLowerCase().includes(query) ||
               uniqueId.toLowerCase().includes(query);
      });
      setSearchResults(localResults);
    } else {
      setSearchResults([]);
    }
    
    setIsSearching(false);
  }, [searchQuery, data]);

  // Filter and search transporters
  const filteredTransporters = useMemo(() => {
    if (!data) return [];
    
    // Use search results if searching, otherwise use all transporters
    const sourceData = searchQuery.trim() ? searchResults : data.transporters;
    
    // Apply status filter
    return sourceData.filter((trucker) => {
      const status = trucker.verified_trucker_shipper;
      
      if (filterStatus === "all") return true;
      if (filterStatus === "active") return status === "1" || status === 1;
      if (filterStatus === "inactive") return status === "0" || status === 0;
      if (filterStatus === "pending") return status === null || status === "2" || status === 2 || status === "pending";
      
      return true;
    });
  }, [searchQuery, searchResults, data, filterStatus]);

  const handleViewProfile = async (id: string) => {
    // Navigate to the trucker detail page
    router.push(`/truckers/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <h3 className="text-lg font-bold text-gray-800">Loading Transporters...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 pb-12 bg-[#F8FAFC] min-h-screen">
      {/* Dashboard Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#1e293b]">My Truckers</h1>
        <p className="text-sm text-gray-500">Manage and view trucker profiles</p>
      </div>

          {/* Stats Cards (Matched to Image) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-[#2563eb] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <Users className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Total</Badge>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold">{data?.total_transporters || data?.total_trucker || "0"}</p>
                <p className="text-s font-medium opacity-90 mt-1">Total Truckers</p>
              </div>
            </Card>

            <Card className="bg-[#10b981] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <TrendingUp className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Active</Badge>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold">{data?.total_active || data?.total_active_trucker || "0"}</p>
                <p className="text-s font-medium opacity-90 mt-1">Active Truckers</p>
              </div>
            </Card>

            <Card className="bg-[#a855f7] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <Truck className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Inactive</Badge>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold">{data?.total_inactive || "0"}</p>
                <p className="text-s font-medium opacity-90 mt-1">Inactive Trucker</p>
              </div>
            </Card>

            <Card className="bg-[#f97316] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <Package className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Pending</Badge>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold">{data?.total_pending || data?.total_applied || "0"}</p>
                <p className="text-s font-medium opacity-90 mt-1">Pending Trucker</p>
              </div>
            </Card>
          </div>

          {/* Search & Filters (Matched to Image) */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              <input
                type="text"
                placeholder="Search by unique ID, company name, or trucker name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm placeholder:text-gray-300"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl border border-gray-100 flex gap-0.5 shadow-sm h-14 items-center px-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#2563eb] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#2563eb] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <div className="relative" ref={filterRef}>
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline" 
                  className={`h-14 px-6 rounded-xl border-gray-100 shadow-sm font-semibold flex gap-3 ${
                    showFilters ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="h-5 w-5" />
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
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          filterStatus === "all"
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        All Truckers
                      </button>
                      <button
                        onClick={() => setFilterStatus("active")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          filterStatus === "active"
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFilterStatus("inactive")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          filterStatus === "inactive"
                            ? "bg-gray-100 text-gray-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Inactive
                      </button>
                      <button
                        onClick={() => setFilterStatus("pending")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          filterStatus === "pending"
                            ? "bg-amber-50 text-amber-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-500">
            Showing <span className="text-gray-900 font-bold">{filteredTransporters.length}</span> of <span className="text-gray-900 font-bold">{data?.total || filteredTransporters.length}</span> truckers
          </p>

          {/* User List (Matched to Image Card Style) */}
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredTransporters.map((t, i) => (
                  <motion.div
                    key={t.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white rounded-xl relative h-full flex flex-col min-h-[380px]">
                      {/* Top Header */}
                      <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-100">
                        <div className="h-16 w-16 rounded-lg bg-[#2563eb] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm shadow-blue-100">
                          {t.images ? (
                            <img src={`${IMAGE_URL}${t.images}`} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            (t.transport_name || t.name || "KT").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-[#1e293b] text-base truncate leading-tight mb-0.5">{t.name}</h3>
                          <p className="text-gray-500 font-medium truncate text-xs mb-1">{t.transport_name || "N/A"}</p>
                          <p className="text-gray-400 font-medium truncate text-xs mb-2">{t.unique_id}</p>
                          <Badge className={`border-none px-3 py-0.5 text-[10px] font-bold rounded-md ${
                            t.verified_trucker_shipper === '1' || t.verified_trucker_shipper === 1 
                              ? 'bg-[#f0fdf4] text-[#10b981]' 
                              : t.verified_trucker_shipper === '0' || t.verified_trucker_shipper === 0
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {t.verified_trucker_shipper === '1' || t.verified_trucker_shipper === 1 
                              ? 'Active' 
                              : t.verified_trucker_shipper === '0' || t.verified_trucker_shipper === 0
                              ? 'Inactive'
                              : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {/* Company Type and State Box */}
                      <div className="px-0 border-b border-gray-100 mb-4 pb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-3 text-center min-h-[90px] flex flex-col justify-center">
                            <div className="flex items-center justify-center gap-1.5 mb-2">
                              <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Company Type</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 line-clamp-2">{t.company_type_name || t.company_type || "N/A"}</p>
                          </div>
                          <div className="bg-orange-50/30 border border-orange-100 rounded-xl p-3 text-center min-h-[90px] flex flex-col justify-center">
                            <div className="flex items-center justify-center gap-1.5 mb-2">
                              <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">State</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 line-clamp-2">{t.state_name || t.state || "Rajasthan"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row - 4 buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Button
                          variant="outline"
                          className="rounded-lg border-gray-200 h-10 text-gray-700 font-bold text-xs bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 px-0"
                          onClick={() => handleViewProfile(t.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Profile
                        </Button>
                        <Button
                          className="rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white h-10 font-bold text-xs flex items-center justify-center gap-1.5 px-0 shadow-md shadow-blue-50"
                          onClick={() => router.push(`/truckers/${t.id}/vehicles`)}
                        >
                          <Truck className="h-3.5 w-3.5 text-white" />
                          Trucks ({t.total_vehicles})
                        </Button>
                        <Button
                          className="rounded-lg bg-[#059669] hover:bg-emerald-700 text-white h-10 font-bold text-xs flex items-center justify-center gap-1.5 px-0 shadow-md shadow-emerald-50"
                        >
                          <Phone className="h-3.5 w-3.5 text-white" />
                          Call
                        </Button>
                        <div className="rounded-lg bg-purple-100 border border-purple-200 h-10 flex items-center justify-center gap-1.5 px-3">
                          <FileText className="h-3.5 w-3.5 text-purple-600" />
                          <span className="font-bold text-xs text-purple-700">Bids: {t.total_bids || t.total_applied || t.bid_count || 0}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {filteredTransporters.map((t) => (
                  <Card key={t.id} className="p-4 border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left side - Profile info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase flex-shrink-0">
                          {(t.name || "?").charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 truncate">{t.name}</h3>
                          <p className="text-xs text-gray-600 truncate">{t.transport_name || "N/A"}</p>
                          <p className="text-xs text-gray-500 truncate">{t.unique_id}</p>
                          <div className="mt-1">
                            <Badge variant={
                              t.verified_trucker_shipper === '1' || t.verified_trucker_shipper === 1 
                                ? 'confirmed' 
                                : t.verified_trucker_shipper === '0' || t.verified_trucker_shipper === 0
                                ? 'cancelled'
                                : 'pending'
                            } className="text-[10px] px-2 py-0">
                              {t.verified_trucker_shipper === '1' || t.verified_trucker_shipper === 1 
                                ? 'Active' 
                                : t.verified_trucker_shipper === '0' || t.verified_trucker_shipper === 0
                                ? 'Inactive'
                                : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Company Type and State - Left Side */}
                      <div className="flex gap-6 mr-16 flex-shrink-0">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-xs text-gray-500 font-medium">State</span>
                          </div>
                          <span className="text-sm text-gray-800 font-semibold pl-5 truncate" title={t.state_name || t.state || "Rajasthan"}>{t.state_name || t.state || "Rajasthan"}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-40">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                            <span className="text-xs text-gray-500 font-medium">Company Type</span>
                          </div>
                          <span className="text-sm text-gray-800 font-semibold pl-5 truncate" title={t.company_type_name || t.company_type || "N/A"}>{t.company_type_name || t.company_type || "N/A"}</span>
                        </div>
                      </div>

                      {/* Right side - Action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gray-200"
                          onClick={() => handleViewProfile(t.id)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => router.push(`/truckers/${t.id}/vehicles`)}
                        >
                          <Truck className="h-4 w-4 mr-1.5" />
                          Trucks ({t.total_vehicles})
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </Button>
                        <div className="rounded-xl bg-purple-100 border border-purple-200 px-4 py-2 flex items-center justify-center gap-1.5">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-700">Bids: {t.total_bids || t.total_applied || t.bid_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Redesigned Pagination Section (Matched to Image) */}
          {data && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
              <div className="text-sm text-[#64748b]">
                Showing <span className="font-semibold">{(currentPage - 1) * data.per_page + 1}</span> to <span className="font-semibold">{Math.min(currentPage * data.per_page, data.total)}</span> of <span className="font-semibold">{data.total}</span> results
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
    </div>
    
    {/* Search Modal */}
    <SearchModal
      isOpen={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
    />
    </>
  );
}
