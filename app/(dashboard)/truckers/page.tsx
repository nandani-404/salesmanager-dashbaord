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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrucker, setSelectedTrucker] = useState<TruckerDetail | null>(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

  // Filter and search transporters
  const filteredTransporters = useMemo(() => {
    if (!data) return [];
    return data.transporters.filter((t) => {
      const name = t.name || "";
      const transportName = t.transport_name || "";
      const uniqueId = t.unique_id || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uniqueId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, data]);

  const handleViewProfile = async (id: string) => {
    try {
      setFetchingDetail(true);
      const response = await apiClient.get<{ trucker: TruckerDetail }>(API_ENDPOINTS.dashboard.truckerDetail(id));
      setSelectedTrucker(response.data.trucker);
      setShowProfile(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Failed to fetch trucker details:", err);
    } finally {
      setFetchingDetail(false);
    }
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
      {!showProfile ? (
        <>
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
                placeholder="Search by company name or trucker ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm placeholder:text-gray-300"
              />
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
                            (t.transport_name || t.name || "KT").split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
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
                  <Card key={t.id} className="p-4 border-none shadow-sm flex items-center justify-between gap-4 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-4 flex-1" onClick={() => handleViewProfile(t.id)}>
                      <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                        {(t.transport_name || t.name || "?").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{t.transport_name || t.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{t.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-12 items-center mr-10 hidden md:flex">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Loads</p>
                        <p className="font-bold text-gray-900">{t.total_applied}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fleet</p>
                        <p className="font-bold text-gray-900">{t.total_vehicles}</p>
                      </div>
                      <Badge className={`border-none px-4 py-1 text-[10px] font-bold ${t.verified_trucker_shipper === '1' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                        {t.verified_trucker_shipper === '1' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-gray-100 h-10 w-10"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 px-3 py-2.5 rounded-xl border border-blue-100">{t.unique_id}</span>
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
        </>
      ) : (
        /* --- NEW PROFILE UI (MATCHING THE IMAGE) --- */
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-6">
          {/* Top Breadcrumb & Back */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfile(false)}
              className="h-10 w-10 border-gray-200 bg-white rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Profile</h1>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <LayoutDashboard className="h-3 w-3" /> Dashboard
              </p>
            </div>
          </div>

          {/* Main Identity Card */}
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
            <div className="p-8 pb-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-100 flex-shrink-0">
                    {(selectedTrucker?.name || "P").charAt(0)}{(selectedTrucker?.name?.split(" ")[1] || "").charAt(0) || "S"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTrucker?.name}</h2>
                    <p className="text-sm font-medium text-gray-500 mb-2">{selectedTrucker?.transport_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-600 border-none px-2 py-0.5 text-[10px] font-mono font-bold tracking-tight">
                        TM ID: {selectedTrucker?.unique_id}
                      </Badge>
                      {selectedTrucker?.verified_trucker_shipper === "1" && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" /> Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="min-w-[130px] p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Truck className="h-3 w-3" /> Total Vehicles
                    </p>
                    <p className="text-2xl font-black text-blue-900 leading-none">{selectedTrucker?.total_vehicles || 0}</p>
                  </div>
                  <div className="min-w-[130px] p-4 bg-orange-50/50 rounded-2xl border border-orange-100/30">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Activity className="h-3 w-3" /> Active Loads
                    </p>
                    <p className="text-2xl font-black text-orange-900 leading-none">8</p>
                  </div>
                  <div className="min-w-[130px] p-4 bg-purple-50/50 rounded-2xl border border-purple-100/30">
                    <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Location
                    </p>
                    <p className="text-sm font-bold text-purple-900 leading-tight truncate max-w-[100px]">{selectedTrucker?.city || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 mt-8 pt-8 border-t border-gray-50 overflow-x-auto whitespace-nowrap">
                <Button variant="outline" className="h-10 rounded-xl px-5 border-gray-200 text-xs font-bold text-gray-600">
                  <Mail className="h-3.5 w-3.5 mr-2" /> Send Email
                </Button>
                <Button variant="outline" className="h-10 rounded-xl px-5 border-gray-200 text-xs font-bold text-gray-600">
                  <Phone className="h-3.5 w-3.5 mr-2" /> Call
                </Button>
                <Button
                  className="h-10 rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-xs font-bold shadow-lg shadow-blue-50"
                  onClick={() => router.push(`/truckers/${selectedTrucker?.id}/vehicles`)}
                >
                  View Trucks
                </Button>
              </div>
            </div>
          </Card>

          {/* Section: Basic Details */}
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.name}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.transport_name}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.email || "prince.singh@singhexpress.com"}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mobile No <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">+91 {selectedTrucker?.mobile}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Alternate Phone</label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">+91 {selectedTrucker?.mobile}</div>
                </div>

              </div>
            </div>
          </Card>

          {/* Section: Business Details */}
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-50">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Business Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Yrs in Business <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.Year_of_Establishment || "5-10 years"}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fleet Size <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.Fleet_Size || "10-20 trucks"}</div>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Office Address <span className="text-red-500">*</span></label>
                  <div className="h-16 w-full p-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-start font-medium text-gray-700 leading-relaxed">{selectedTrucker?.address || "Plot No. 45, Transport Nagar, Industrial Area Phase 2"}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.state_name}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.city}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">PIN Code <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-purple-50 flex items-center justify-between">
                    <span className="font-bold text-purple-700 ml-4">{selectedTrucker?.pincode}</span>
                    <Badge className="bg-purple-600 text-white border-none py-0.5 px-1.5 text-[9px] font-black mr-2">PIN</Badge>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Registration Number <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700 uppercase tracking-widest">{selectedTrucker?.Registered_ID || "KA-2018-SEC-123456"}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Established Year <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">2015</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Bank Details */}
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-50">
                  <Landmark className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Bank Details</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bank Name <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.bank_name || "HDFC Bank"}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Number <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-mono font-bold text-gray-700 tracking-wider">{selectedTrucker?.account_number}</div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Re-Enter Account Number <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-mono font-bold text-gray-700 tracking-wider">{selectedTrucker?.account_number}</div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">IFSC Code <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-mono font-bold text-blue-600 uppercase">{selectedTrucker?.ifsc_code}</div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Holder Name <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.account_holder_name}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Branch Name <span className="text-red-500">*</span></label>
                  <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center font-medium text-gray-700">{selectedTrucker?.branch_name || "Bangalore - Koramangala"}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: KYC Details */}
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-9 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">KYC Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* PAN Column */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">PAN <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-orange-50/10 flex items-center justify-between shadow-sm">
                      <span className="font-mono font-black text-slate-700 uppercase tracking-widest">{selectedTrucker?.PAN_Number}</span>
                      <Badge className="bg-orange-500 text-white border-none py-0.5 px-1.5 text-[9px] font-black">PAN</Badge>
                    </div>
                  </div>

                  {selectedTrucker?.PAN_Image && (
                    <div className="relative group">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl border-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold"
                        onClick={() => window.open(`${IMAGE_URL}${selectedTrucker.PAN_Image}`, '_blank')}
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Full PAN
                      </Button>

                      {/* Hover Preview Box */}
                      <div className="absolute bottom-full left-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 scale-95 group-hover:scale-100">
                        <Card className="p-1 shadow-2xl border-orange-200 overflow-hidden bg-white min-w-[200px]">
                          <div className="p-2 bg-orange-50/50 border-b border-orange-100 text-[10px] font-bold text-orange-600 flex items-center gap-1.5">
                            <FileText className="h-3 w-3" /> Documents Preview
                          </div>
                          <img
                            src={`${IMAGE_URL}${selectedTrucker.PAN_Image}`}
                            alt="PAN Preview"
                            className="w-full h-auto max-h-48 rounded-lg object-contain p-1"
                          />
                        </Card>
                      </div>
                    </div>
                  )}
                </div>

                {/* GST Column */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">GST <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-lg border border-gray-200 bg-blue-50/10 flex items-center justify-between shadow-sm">
                      <span className="font-mono font-black text-blue-700 uppercase tracking-widest">{selectedTrucker?.GST_Number}</span>
                      <Badge className="bg-blue-500 text-white border-none py-0.5 px-1.5 text-[9px] font-black">GST</Badge>
                    </div>
                  </div>

                  {selectedTrucker?.GST_Certificate && (
                    <div className="relative group">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                        onClick={() => window.open(`${IMAGE_URL}${selectedTrucker.GST_Certificate}`, '_blank')}
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Full GST
                      </Button>

                      {/* Hover Preview Box */}
                      <div className="absolute bottom-full left-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 scale-95 group-hover:scale-100">
                        <Card className="p-1 shadow-2xl border-blue-200 overflow-hidden bg-white min-w-[200px]">
                          <div className="p-2 bg-blue-50/50 border-b border-blue-100 text-[10px] font-bold text-blue-600 flex items-center gap-1.5">
                            <FileText className="h-3 w-3" /> Documents Preview
                          </div>
                          <img
                            src={`${IMAGE_URL}${selectedTrucker.GST_Certificate}`}
                            alt="GST Preview"
                            className="w-full h-auto max-h-48 rounded-lg object-contain p-1"
                          />
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>


        </motion.div>
      )}
    </div>
  );
}
