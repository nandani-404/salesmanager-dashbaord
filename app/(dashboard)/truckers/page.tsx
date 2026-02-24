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
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, BASE_URL } from "@/config/page";

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
}

interface TransportersResponse {
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

  // Fetch Transporters
  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<TransportersResponse>(`${API_ENDPOINTS.dashboard.transporters}?page=${currentPage}`);
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

  // Dynamic search with debouncing (using local search only)
  useEffect(() => {
    const searchUsers = () => {
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
      }
      setSearchError(null);
      setIsSearching(false);
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, data]);

  // Filter and search transporters
  const filteredTransporters = useMemo(() => {
    if (!data) return [];
    
    // Use search results if searching, otherwise use all transporters
    const sourceData = searchQuery.trim() ? searchResults : data.transporters;
    
    return sourceData;
  }, [searchQuery, searchResults, data]);

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
              <div className="mt-4">
                <p className="text-3xl font-bold">{data?.total_trucker || "0"}</p>
                <p className="text-xs font-medium opacity-90 mt-1">Total Truckers</p>
              </div>
            </Card>

            <Card className="bg-[#10b981] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <TrendingUp className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Active</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{data?.total_active_trucker || "0"}</p>
                <p className="text-xs font-medium opacity-90 mt-1">Active Truckers</p>
              </div>
            </Card>

            <Card className="bg-[#a855f7] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <Truck className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Fleet</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{data?.total_vehicle || "0"}</p>
                <p className="text-xs font-medium opacity-90 mt-1">Total Vehicles</p>
              </div>
            </Card>

            <Card className="bg-[#f97316] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
              <div className="flex justify-between items-start">
                <Package className="h-8 w-8 opacity-90" />
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Loads</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{data?.total_applied || "0"}</p>
                <p className="text-xs font-medium opacity-90 mt-1">Applied Loads</p>
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
              <Button variant="outline" className="h-14 px-6 rounded-xl border-gray-100 bg-white shadow-sm text-gray-600 font-semibold flex gap-3 hover:bg-gray-50">
                <Filter className="h-5 w-5" />
                Filters
              </Button>
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
                    <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white rounded-xl relative">
                      {/* Top Header */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="h-16 w-16 rounded-lg bg-[#2563eb] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm shadow-blue-100">
                          {t.images ? (
                            <img src={`${IMAGE_URL}${t.images}`} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            (t.transport_name || t.name || "KT").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-[#1e293b] text-base truncate leading-tight mb-0.5">{t.transport_name || t.name}</h3>
                          <p className="text-gray-400 font-medium truncate text-xs mb-2">{t.name}</p>
                          <Badge className="bg-[#f0fdf4] text-[#10b981] border-none px-3 py-0.5 text-[10px] font-bold rounded-md">
                            Active
                          </Badge>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-4 bg-[#f0fdfa] rounded-lg border border-[#ccfbf1]/60">
                          <p className="text-[10px] font-bold text-[#10b981] mb-1.5 uppercase tracking-tight">Completed Loads</p>
                          <p className="text-2xl font-black text-[#047857] leading-none">{t.total_applied}</p>
                        </div>
                        <div className="p-4 bg-[#fffaf0] rounded-lg border border-[#ffedd5]/60">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Truck className="h-3.5 w-3.5 text-[#f97316]" />
                            <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-tight">Vehicles</p>
                          </div>
                          <p className="text-2xl font-black text-[#c2410c] leading-none">{t.total_vehicles}</p>
                        </div>
                      </div>

                      {/* Unique ID Center Bar */}
                      <div className="bg-[#eff6ff] rounded-lg py-3 text-center mb-5 border border-blue-50/50">
                        <span className="text-[#2563eb] font-bold text-sm tracking-widest">{t.unique_id}</span>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="rounded-lg border-gray-200 h-10 text-gray-700 font-bold text-xs bg-white hover:bg-gray-50 flex items-center justify-center gap-2 px-0"
                          onClick={() => handleViewProfile(t.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Profile
                        </Button>
                        <Button
                          className="rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white h-10 font-bold text-xs flex items-center justify-center gap-2 px-0 shadow-md shadow-blue-50"
                          onClick={() => router.push(`/truckers/${t.id}/vehicles`)}
                        >
                          <Truck className="h-3.5 w-3.5 text-white" />
                          Trucks
                        </Button>
                        <Button
                          className="rounded-lg bg-[#059669] hover:bg-emerald-700 text-white h-10 font-bold text-xs flex items-center justify-center gap-2 px-0 shadow-md shadow-emerald-50"
                        >
                          <Phone className="h-3.5 w-3.5 text-white" />
                          Call
                        </Button>
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
                        </div>
                      </div>

                      {/* Middle - Stats */}
                      <div className="flex gap-8 items-center hidden md:flex">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Loads</p>
                          <p className="font-bold text-gray-900">{t.total_applied}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fleet</p>
                          <p className="font-bold text-gray-900">{t.total_vehicles}</p>
                        </div>
                        <Badge variant={t.verified_trucker_shipper === '1' ? 'confirmed' : 'cancelled'}>
                          {t.verified_trucker_shipper === '1' ? 'Active' : 'Inactive'}
                        </Badge>
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
                          Profile
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => router.push(`/truckers/${t.id}/vehicles`)}
                        >
                          <Truck className="h-4 w-4 mr-1.5" />
                          Trucks
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </Button>
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

  );
}
