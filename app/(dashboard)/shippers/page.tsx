"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLoads } from "@/lib/mock-data";
import { mockTruckerBids } from "@/lib/mock-trucker-bids";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { API_ENDPOINTS, BASE_URL } from "@/config/page";
import apiClient from "@/lib/api/client";
import { Shipper } from "@/lib/types";
import SearchModal from "@/components/search/search-modal";
import {
  Search,
  Plus,
  Mail,
  Phone,
  TrendingUp,
  Check,
  X,
  User,
  Package,
  ArrowLeft,
  Eye,
  MapPin,
  Star,
  UserX,
  FileText,
  Clock,
  Grid3x3,
  List,
  Filter,
  Sparkles,
  Activity,
  AlertCircle,
  FileCheck,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "grid" | "profile" | "shipments" | "load-detail" | "bids";

interface ApiShipper {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  unique_id: string;
  profile_image: string | null;
  images: string | null;
  company_name: string | null;
  company_registration_type: string | null;
  years_in_business: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
  states: string | null;
  state_id: string | null;
  state_name: string | null;
  no_second_poc: boolean;
  name_poc: string | null;
  phone_poc: string | null;
  gst_not_applicable: boolean;
  gst_number: string | null;
  legal_name: string | null;
  address: string | null;
  gst_certificate: string | null;
  pan_number: string | null;
  name_as_per_pan: string | null;
  dob_as_per_pan: string | null;
  pan_image: string | null;
  profile_created_at: string | null;
  profile_updated_at: string | null;
  kyc_verified: string;
  status: string;
  load_count: string;
  total_bids: string;
  total_ratings: string;
  average_rating: number;
  created_at?: string;
}

interface ApiShipperLoad {
  id: number;
  load_id: string;
  origin_location: string;
  destination_location: string;
  material: string;
  material_name?: string;
  price: string;
  pickup_date: string | null;
  load_time: string | null;
  status: string;
  load_qty: string;
  bid_count?: number;
  total_bids?: number;
}

interface ApiLoadDetail {
  id: number;
  load_id: string;
  user_id: string;
  origin_location: string;
  exact_origin_location: string;
  destination_location: string;
  exact_destination_location: string;
  material: string;
  material_quantity: string;
  load_qty: string;
  vehicle_body: string | null;
  vehicle_type: string | null;
  container_feet: string | null;
  price: string;
  adv_price: string;
  setteled_price: string;
  pickup_date: string | null;
  load_time: string | null;
  odc: string | null;
  status: string;
  setteled_by: string | null;
  created_at: string;
  updated_at: string;
}

interface UpdateStatusPayload {
  kyc_verified: number;
  shipper_percentage: number;
  custome_commission: number;
  payment_terms: string;
}

export default function ShippersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState<Shipper | null>(null);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Shipper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [shipmentsPage, setShipmentsPage] = useState(1);
  const shipmentsPerPage = 10;

  const [counterDialogOpen, setCounterDialogOpen] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterOffers, setCounterOffers] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    total_shippers: 0,
    total_active: 0,
    total_pending: 0,
  });
  const [shipperApiLoads, setShipperApiLoads] = useState<ApiShipperLoad[]>([]);
  const [shipperLoadsLoading, setShipperLoadsLoading] = useState(false);
  const [shipperLoadsError, setShipperLoadsError] = useState<string | null>(null);
  const [loadDetail, setLoadDetail] = useState<ApiLoadDetail | null>(null);
  const [loadDetailLoading, setLoadDetailLoading] = useState(false);
  const [loadDetailError, setLoadDetailError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Approval form state
  const [kycVerified, setKycVerified] = useState<number>(0);
  const [shipperPercentage, setShipperPercentage] = useState<number>(80);
  const [customeCommission, setCustomeCommission] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState<string>("15 Days Credit");
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateStatusError, setUpdateStatusError] = useState<string | null>(null);
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Helper function to format price
  const formatPrice = (price: string | number) => {
    if (!mounted) return '...';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return num.toLocaleString('en-IN');
  };

  // Helper function to format date in UTC
  const formatUTC = (dateString?: string | null) => {
    if (!mounted || !dateString) return '...';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).toUpperCase();
    } catch {
      return 'N/A';
    }
  };

  // Set mounted state for client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        let url = API_ENDPOINTS.dashboard.shippers;
        if (filterStatus !== "all") {
          url += `?status=${filterStatus}`;
        }
        const response = await apiClient.get<any>(url);
        const data = response.data;

        // Handle nested shippers data, supporting common patterns like data.shippers.data or data.shippers
        const shippersList = Array.isArray(data.shippers)
          ? data.shippers
          : (data.shippers?.data || data.data || []);

        const apiShippers: ApiShipper[] = shippersList;

        console.log('API Shippers sample:', apiShippers[0]);
        console.log('State fields:', {
          state: apiShippers[0]?.state,
          states: apiShippers[0]?.states,
          state_id: apiShippers[0]?.state_id,
          state_name: apiShippers[0]?.state_name
        });

        const mappedShippers: Shipper[] = apiShippers.map((s) => {
          console.log(`Mapping shipper ${s.id}:`, {
            state_name: s.state_name,
            state: s.state,
            company_type: s.company_registration_type
          });
          return {
            id: s.id.toString(),
            shipperId: s.unique_id,
            companyName: s.company_name || s.name || "Unknown Company",
            contactPerson: s.name || "Unknown Contact",
            email: s.email || "",
            phone: s.mobile || "",
            profileImage: s.images
              ? (s.images.startsWith('http') ? s.images : `${BASE_URL}/public/${s.images}`)
              : null,
            address: {
              address: s.address || "",
              city: s.city || "",
              state: s.state_name || s.state || "N/A",
              zipCode: s.pincode || "",
            },
            paymentTerms: "Net 30",
            totalBusinessVolume: 0,
            averageLoadValue: 0,
            reliabilityScore: 0,
            rating: Number(s.average_rating) || 0,
            activeLoadsCount: parseInt(s.load_count) || 0,
            totalBids: parseInt(s.total_bids) || 0,
            totalRatings: parseInt(s.total_ratings) || 0,
            companyRegistrationType: s.company_registration_type || "N/A",
            yearsInBusiness: s.years_in_business || null,
            pincode: s.pincode || null,
            noSecondPoc: s.no_second_poc ?? true,
            namePoc: s.name_poc || null,
            phonePoc: s.phone_poc || null,
            gstNotApplicable: s.gst_not_applicable ?? false,
            gstNumber: s.gst_number || null,
            legalName: s.legal_name || null,
            gstCertificate: s.gst_certificate || null,
            panNumber: s.pan_number || null,
            nameAsPerPan: s.name_as_per_pan || null,
            dobAsPerPan: s.dob_as_per_pan || null,
            panImage: s.pan_image || null,
            profileCreatedAt: s.profile_created_at || null,
            profileUpdatedAt: s.profile_updated_at || null,
            kycVerified: s.kyc_verified || "0",
            status: s.status || "Inactive",
            createdAt: s.created_at || null,
          };
        });

        console.log('Mapped Shippers sample:', mappedShippers[0]);

        setShippers(mappedShippers);

        // Use individual counts if available, otherwise calculate from list
        const total = parseInt(data.total_shippers) || mappedShippers.length;
        const active = parseInt(data.total_active) || mappedShippers.filter(s => s.status.toLowerCase() === "active").length;
        const pending = parseInt(data.total_pending) || mappedShippers.filter(s => ["pending", "pending approval"].includes(s.status.toLowerCase())).length;

        setStats({
          total_shippers: total,
          total_active: active,
          total_pending: pending,
        });

        if (mappedShippers.length > 0) {
          setSelectedShipper(mappedShippers[0]);
        }
      } catch (error) {
        console.error("Failed to fetch shippers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!searchQuery.trim()) {
      fetchShippers();
    }
  }, [filterStatus, searchQuery]);

  // Check for profile query parameter and auto-open profile
  useEffect(() => {
    const profileId = searchParams.get('profile');
    const view = searchParams.get('view');
    console.log('Profile ID from URL:', profileId);
    console.log('View from URL:', view);
    console.log('Shippers loaded:', shippers.length);
    if (profileId && shippers.length > 0) {
      const shipper = shippers.find(s => s.id === profileId);
      console.log('Found shipper:', shipper);
      if (shipper) {
        if (view === 'shipments') {
          console.log('Opening shipments for shipper:', shipper.companyName);
          handleViewShipments(shipper);
        } else {
          console.log('Opening profile for shipper:', shipper.companyName);
          handleViewProfile(shipper);
        }
      }
    }
  }, [searchParams, shippers]);

  // Dynamic search with API filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        // Hit the API with the search query
        let url = `${API_ENDPOINTS.dashboard.shippers}?query=${encodeURIComponent(searchQuery)}`;
        if (filterStatus !== "all") {
          url += `&status=${filterStatus}`;
        }
        const response = await apiClient.get<any>(url);

        // Handle nested shippers data similar to main load logic
        const shippersList = Array.isArray(response.data.shippers)
          ? response.data.shippers
          : (response.data.shippers?.data || response.data.data || []);

        const apiShippers: ApiShipper[] = shippersList;

        const mappedSearchResults: Shipper[] = apiShippers.map((s) => ({
          id: s.id.toString(),
          shipperId: s.unique_id,
          companyName: s.company_name || s.name || "Unknown Company",
          contactPerson: s.name || "Unknown Contact",
          email: s.email || "",
          phone: s.mobile || "",
          profileImage: s.images
            ? (s.images.startsWith('http') ? s.images : `${BASE_URL}/public/${s.images}`)
            : null,
          address: {
            address: s.address || "",
            city: s.city || "",
            state: s.state_name || s.state || "N/A",
            zipCode: s.pincode || "",
          },
          paymentTerms: "Net 30",
          totalBusinessVolume: 0,
          averageLoadValue: 0,
          reliabilityScore: 0,
          rating: Number(s.average_rating) || 0,
          activeLoadsCount: parseInt(s.load_count) || 0,
          totalBids: parseInt(s.total_bids) || 0,
          totalRatings: parseInt(s.total_ratings) || 0,
          companyRegistrationType: s.company_registration_type || "N/A",
          yearsInBusiness: s.years_in_business || null,
          pincode: s.pincode || null,
          noSecondPoc: s.no_second_poc ?? true,
          namePoc: s.name_poc || null,
          phonePoc: s.phone_poc || null,
          gstNotApplicable: s.gst_not_applicable ?? false,
          gstNumber: s.gst_number || null,
          legalName: s.legal_name || null,
          gstCertificate: s.gst_certificate || null,
          panNumber: s.pan_number || null,
          nameAsPerPan: s.name_as_per_pan || null,
          dobAsPerPan: s.dob_as_per_pan || null,
          panImage: s.pan_image || null,
          profileCreatedAt: s.profile_created_at || null,
          profileUpdatedAt: s.profile_updated_at || null,
          kycVerified: s.kyc_verified || "0",
          status: s.status || "Inactive",
          createdAt: s.created_at || null,
        }));

        setSearchResults(mappedSearchResults);
      } catch (err: any) {
        console.error("Search error:", err);
        setSearchError("Failed to search shippers");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  const filteredShippers = searchQuery.trim() ? searchResults : shippers;

  // Pagination calculations
  const totalPages = Math.ceil(filteredShippers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShippers = filteredShippers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const shipperLoads = selectedShipper
    ? mockLoads.filter((load) => load.shipperId === selectedShipper.id)
    : [];

  const loadBids = selectedLoad
    ? mockTruckerBids.filter((bid) => bid.loadId === selectedLoad.id)
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "accepted":
        return "delivered";
      case "rejected":
        return "cancelled";
      case "counter-offered":
        return "in-transit";
      default:
        return "default";
    }
  };

  const handleViewProfile = async (shipper: any) => {
    setSelectedShipper(shipper);
    setViewMode("profile");
    // Reset approval form state
    setKycVerified(0);
    setShipperPercentage(80);
    setCustomeCommission(0);
    setPaymentTerms("15 Days Credit");
    setUpdateStatusError(null);
    setUpdateStatusSuccess(false);

    // Fetch full shipper details
    setProfileLoading(true);
    try {
      const response = await apiClient.get<any>(
        `${API_ENDPOINTS.dashboard.shippersFull}?shipper_id=${shipper.id}`
      );
      const fullData: ApiShipper = response.data.shipper;
      if (fullData) {
        const enrichedShipper: Shipper = {
          id: fullData.id.toString(),
          shipperId: fullData.unique_id,
          companyName: fullData.company_name || fullData.name,
          contactPerson: fullData.name,
          email: fullData.email || "",
          phone: fullData.mobile,
          profileImage: fullData.images
            ? (fullData.images.startsWith('http') ? fullData.images : `${BASE_URL}/public/${fullData.images}`)
            : null,
          address: {
            address: fullData.address || "",
            city: fullData.city || "",
            state: fullData.state_name || "",
            zipCode: fullData.pincode || "",
          },
          paymentTerms: "Net 30",
          totalBusinessVolume: 0,
          averageLoadValue: 0,
          reliabilityScore: 0,
          rating: Number(fullData.average_rating) || 0,
          activeLoadsCount: parseInt(fullData.load_count) || 0,
          totalBids: parseInt(fullData.total_bids) || 0,
          totalRatings: parseInt(fullData.total_ratings) || 0,
          companyRegistrationType: fullData.company_registration_type || null,
          yearsInBusiness: fullData.years_in_business || null,
          pincode: fullData.pincode || null,
          noSecondPoc: fullData.no_second_poc ?? true,
          namePoc: fullData.name_poc || null,
          phonePoc: fullData.phone_poc || null,
          gstNotApplicable: fullData.gst_not_applicable ?? false,
          gstNumber: fullData.gst_number || null,
          legalName: fullData.legal_name || null,
          gstCertificate: fullData.gst_certificate || null,
          panNumber: fullData.pan_number || null,
          nameAsPerPan: fullData.name_as_per_pan || null,
          dobAsPerPan: fullData.dob_as_per_pan || null,
          panImage: fullData.pan_image || null,
          profileCreatedAt: fullData.profile_created_at || null,
          profileUpdatedAt: fullData.profile_updated_at || null,
          kycVerified: fullData.kyc_verified || "0",
          status: fullData.status || "Inactive",
          createdAt: fullData.created_at || null,
        };
        setSelectedShipper(enrichedShipper);
        // Update form state with actual shipper data
        setKycVerified(parseInt(fullData.kyc_verified) || 0);
      }
    } catch (error) {
      console.error("Failed to fetch full shipper details:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipper) return;
    setUpdateStatusLoading(true);
    setUpdateStatusError(null);
    setUpdateStatusSuccess(false);
    try {
      const payload: UpdateStatusPayload = {
        kyc_verified: kycVerified,
        shipper_percentage: shipperPercentage,
        custome_commission: customeCommission,
        payment_terms: paymentTerms,
      };
      await apiClient.post(
        API_ENDPOINTS.dashboard.shipperUpdateStatus(selectedShipper.id),
        payload
      );

      // Update local shipper state
      setSelectedShipper({
        ...selectedShipper,
        kycVerified: kycVerified.toString(),
        status: kycVerified === 1 ? "Active" : selectedShipper.status,
      });

      setUpdateStatusSuccess(true);
      // Auto-hide success after 5 seconds
      setTimeout(() => setUpdateStatusSuccess(false), 5000);
    } catch (err: any) {
      console.error("Failed to update shipper status:", err);
      setUpdateStatusError(
        err?.response?.data?.message || err?.message || "Failed to update shipper status"
      );
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const handleViewShipments = async (shipper: any) => {
    setSelectedShipper(shipper);
    setViewMode("shipments");
    setShipmentsPage(1); // Reset to first page
    setShipperLoadsLoading(true);
    setShipperLoadsError(null);
    setShipperApiLoads([]);
    try {
      // Try shipper-specific endpoint first
      try {
        const response = await apiClient.get<any>(API_ENDPOINTS.dashboard.shipperLoads(shipper.id));
        const data = response.data;
        if (data.shipper && data.shipper.loads) {
          setShipperApiLoads(data.shipper.loads);
        } else if (Array.isArray(data.loads)) {
          setShipperApiLoads(data.loads);
        } else {
          setShipperApiLoads([]);
        }
      } catch (specificErr: any) {
        // If shipper-specific endpoint fails, fall back to general loads endpoint and filter
        console.log("Shipper-specific endpoint failed, using general loads endpoint");
        const response = await apiClient.get<any>(API_ENDPOINTS.dashboard.shipmentsLoads);
        const allLoads = response.data?.loads || [];
        // Filter loads by shipper ID (user_id matches shipper.id)
        const shipperLoads = allLoads.filter((load: any) =>
          load.user_id?.toString() === shipper.id?.toString()
        );
        setShipperApiLoads(shipperLoads);
      }
    } catch (err: any) {
      console.error("Failed to fetch shipper loads:", err);
      setShipperLoadsError(err?.response?.data?.message || "Failed to fetch loads");
    } finally {
      setShipperLoadsLoading(false);
    }
  };

  const handleViewLoadDetail = async (load: any) => {
    // Navigate to the shipment detail page
    router.push(`/shipment/${load.id}`);
  };

  const handleViewBids = (load: any) => {
    // Navigate to the bids page for this load with shipper context
    router.push(`/shipment/${load.id}/bids?returnTo=shippers&shipperId=${selectedShipper?.id}`);
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
    setSelectedLoad(null);
  };

  const handleBackToShipments = () => {
    setViewMode("shipments");
    setSelectedLoad(null);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {viewMode === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Shippers</h1>
              <p className="text-gray-600">Manage and track all your shipper relationships in one place</p>
            </div>

            {/* Stats Cards with Flip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Shippers Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-[140px]"
              >
                <Card className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <User className="h-8 w-8 opacity-80" />
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">{stats.total_shippers}</p>
                    <p className="text-sm opacity-90">Total Shippers</p>
                  </div>
                </Card>
              </motion.div>

              {/* Active Shippers Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="h-[140px]"
              >
                <Card className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="h-8 w-8 opacity-80" />
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">
                      {stats.total_active}
                    </p>
                    <p className="text-sm opacity-90">Active Shippers</p>
                  </div>
                </Card>
              </motion.div>

              {/* Inactive Shippers Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-[140px]"
              >
                <Card className="w-full h-full bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-500 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <UserX className="h-8 w-8 opacity-80" />
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Inactive</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">
                      {stats.total_shippers - stats.total_active - stats.total_pending}
                    </p>
                    <p className="text-sm opacity-90">Inactive Shippers</p>
                  </div>
                </Card>
              </motion.div>

              {/* Pending Shippers Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="h-[140px]"
              >
                <Card className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 opacity-80" />
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">
                      {stats.total_pending}
                    </p>
                    <p className="text-sm opacity-90">Pending Shippers</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Search Bar and View Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shippers by unique ID, name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-600 animate-spin" />
                )}
              </div>
              <div className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setDisplayMode("grid")}
                  className={`h-10 px-4 rounded-lg flex items-center gap-2 transition-all ${displayMode === "grid"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Grid</span>
                </button>
                <button
                  onClick={() => setDisplayMode("list")}
                  className={`h-10 px-4 rounded-lg flex items-center gap-2 transition-all ${displayMode === "list"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <List className="h-4 w-4" />
                  <span className="text-sm font-medium">List</span>
                </button>
              </div>

              {/* Filter Button */}
              <div className="relative" ref={filterRef}>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 px-6 rounded-xl shadow-sm ${showFilters
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
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
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        All Shippers
                      </button>
                      <button
                        onClick={() => setFilterStatus("active")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "active"
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFilterStatus("inactive")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "inactive"
                          ? "bg-gray-100 text-gray-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Inactive
                      </button>
                      <button
                        onClick={() => setFilterStatus("pending")}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${filterStatus === "pending"
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Pending                    </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-800">{filteredShippers.length}</span> of{" "}
                <span className="font-semibold text-gray-800">{shippers.length}</span> shippers
              </p>
            </div>

            {/* Shipper Cards - Grid or List View */}
            <div
              className={
                displayMode === "grid"
                  ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {paginatedShippers.map((shipper, index) => (
                <motion.div
                  key={shipper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {displayMode === "grid" ? (
                    <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white rounded-2xl overflow-hidden h-full flex flex-col min-h-[320px]">
                      <CardContent className="p-0 flex flex-col h-full" suppressHydrationWarning>
                        {/* Header with subtle gradient background */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 border-b border-gray-100">
                          <div className="flex items-start gap-4">
                            <motion.button
                              layoutId={`profile-icon-${shipper.id}`}
                              onClick={() => router.push(`/shippers/${shipper.id}`)}
                              className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer shadow-md overflow-hidden"
                            >
                              {shipper.profileImage ? (
                                <img
                                  src={shipper.profileImage}
                                  alt={shipper.companyName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-8 w-8 text-white" />
                              )}
                            </motion.button>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-800 text-lg mb-2 truncate">
                                {shipper.companyName}
                              </h3>
                              <p className="text-sm text-gray-500 font-medium truncate mb-1">
                                {shipper.shipperId}
                              </p>
                              {shipper.createdAt && (
                                <p className="text-xs text-gray-400 font-medium truncate mb-3">
                                  {formatUTC(shipper.createdAt)}
                                </p>
                              )}
                              <Badge
                                variant={
                                  shipper.status.toLowerCase() === "active" ? "confirmed" :
                                    shipper.status.toLowerCase() === "pending" ? "pending" :
                                      "cancelled"
                                }
                                className="text-xs px-3 py-1"
                              >
                                {shipper.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Company Type and State Box */}
                        <div className="px-6 py-4 border-b border-gray-100">
                          <div className="grid grid-cols-2 gap-3">
                            {shipper.companyRegistrationType && (
                              <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                  <Building2 className="h-4 w-4 text-blue-500" />
                                  <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Company Type</span>
                                </div>
                                <p className="text-lg font-bold text-gray-700">{shipper.companyRegistrationType}</p>
                              </div>
                            )}
                            {shipper.address?.state && (
                              <div className="bg-orange-50/30 border border-orange-100 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                  <MapPin className="h-4 w-4 text-orange-500" />
                                  <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">State</span>
                                </div>
                                <p className="text-lg font-bold text-gray-700">{shipper.address.state}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-5 mt-auto">
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm h-11"
                              onClick={() => handleViewProfile(shipper)}
                            >
                              <Eye className="mr-1.5 h-4 w-4" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-11"
                              onClick={() => handleViewShipments(shipper)}
                            >
                              <Package className="mr-1.5 h-4 w-4" />
                              Loads ({shipper.activeLoadsCount})
                            </Button>
                            <Button
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-11"
                              onClick={() => window.open(`tel:${shipper.phone}`, '_self')}
                            >
                              <Phone className="mr-1.5 h-4 w-4" />
                              Call
                            </Button>
                            <div className="w-full bg-purple-100 border border-purple-200 rounded-lg px-4 py-2.5 text-center h-11 flex items-center justify-center">
                              <FileText className="mr-1.5 h-4 w-4 text-purple-600" />
                              <span className="text-sm font-bold text-purple-700">Bids: {shipper.totalBids || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white rounded-xl overflow-hidden">
                      <CardContent className="p-5" suppressHydrationWarning>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                          {/* Profile Icon */}
                          <motion.button
                            layoutId={`profile-icon-${shipper.id}`}
                            onClick={() => router.push(`/shippers/${shipper.id}`)}
                            className="h-14 w-14 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all overflow-hidden"
                          >
                            {shipper.profileImage ? (
                              <img
                                src={shipper.profileImage}
                                alt={shipper.companyName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-slate-600" />
                            )}
                          </motion.button>

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-700 text-base mb-1">
                              {shipper.companyName}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              {shipper.shipperId}
                            </p>
                            {shipper.createdAt && (
                              <p className="text-xs text-gray-400 font-medium truncate mb-2">
                                {formatUTC(shipper.createdAt)}
                              </p>
                            )}
                            <Badge
                              variant={
                                shipper.status.toLowerCase() === "active" ? "confirmed" :
                                  shipper.status.toLowerCase() === "pending" ? "pending" :
                                    "cancelled"
                              }
                            >
                              {shipper.status}
                            </Badge>
                          </div>

                          {/* Company Type and State - Left Side */}
                          <div className="flex gap-6 mr-8 flex-shrink-0">
                            {shipper.address?.state && (
                              <div className="flex flex-col gap-1 w-32">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                                  <span className="text-xs text-gray-500 font-medium">State</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold pl-5 truncate" title={shipper.address.state}>{shipper.address.state}</span>
                              </div>
                            )}
                            {shipper.companyRegistrationType && (
                              <div className="flex flex-col gap-1 w-40">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                                  <span className="text-xs text-gray-500 font-medium">Company Type</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold pl-5 truncate" title={shipper.companyRegistrationType}>{shipper.companyRegistrationType}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex w-full lg:w-auto gap-2 mt-4 lg:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                              onClick={() => handleViewProfile(shipper)}
                            >
                              <Eye className="mr-1.5 h-4 w-4" />
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleViewShipments(shipper)}
                            >
                              <Package className="mr-1.5 h-4 w-4" />
                              Shipments ({shipper.activeLoadsCount})
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => window.open(`tel:${shipper.phone}`, '_self')}
                            >
                              <Phone className="mr-1.5 h-4 w-4" />
                              Call
                            </Button>
                            <div className="bg-purple-100 border border-purple-200 rounded-lg px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <FileText className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-bold text-purple-700">Bids: {shipper.totalBids || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination Section */}
            {filteredShippers.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to <span className="font-semibold text-gray-800">{Math.min(endIndex, filteredShippers.length)}</span> of <span className="font-semibold text-gray-800">{filteredShippers.length}</span> shippers
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
                    Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {viewMode === "profile" && selectedShipper && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </motion.div>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6" suppressHydrationWarning>
                  <div className="flex items-start gap-6 mb-6">
                    <motion.div
                      layoutId={`profile-icon-${selectedShipper.id}`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                    >
                      {selectedShipper.profileImage ? (
                        <img
                          src={selectedShipper.profileImage}
                          alt={selectedShipper.companyName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-white" />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-700">
                        {selectedShipper.companyName}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">
                          {selectedShipper.shipperId}
                        </p>
                        <Badge
                          variant={
                            selectedShipper.status.toLowerCase() === "active" ? "confirmed" :
                              selectedShipper.status.toLowerCase() === "pending" ? "pending" :
                                "cancelled"
                          }
                          className="text-xs px-3 py-1"
                        >
                          {selectedShipper.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {selectedShipper.contactPerson}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">
                          {selectedShipper.email.replace(/(.{2})(.*)(@.*)/, '$1****$3')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">
                          {selectedShipper.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid gap-4 sm:grid-cols-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total Business
                      </p>
                      <p className="text-lg font-bold text-green-700 mt-1">
                        {formatCurrency(selectedShipper.totalBusinessVolume)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total Ratings
                      </p>
                      <p className="text-lg font-bold text-blue-700 mt-1">
                        {selectedShipper.totalRatings}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 px-4 py-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Average Rating
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold text-yellow-700">
                          {selectedShipper.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 px-4 py-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Active Loads
                      </p>
                      <p className="text-lg font-bold text-orange-700 mt-1">
                        {selectedShipper.activeLoadsCount}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      onClick={() => handleViewShipments(selectedShipper)}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      View Shipments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* KYC Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    KYC Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6" suppressHydrationWarning>
                  {profileLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Loading shipper details...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8" suppressHydrationWarning>
                      {/* Company Registration */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-6 w-1 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full" />
                          <h3 className="text-base font-semibold text-gray-700">
                            Company Registration
                          </h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 pl-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Registration Type
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.companyRegistrationType || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              GST Number
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-mono font-semibold text-blue-600">
                                {selectedShipper.gstNotApplicable ? "GST Not Applicable" : (selectedShipper.gstNumber || "N/A")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Company Name (From GST)
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.legalName || selectedShipper.companyName}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 sm:col-span-2 relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              GST Document
                            </label>
                            <div
                              className="relative"
                              onMouseEnter={() => setHoveredDoc("gst")}
                              onMouseLeave={() => setHoveredDoc(null)}
                            >
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 px-4 py-3 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-700">
                                        GST_Certificate.pdf
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Hover to preview
                                      </p>
                                    </div>
                                  </div>
                                  <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              {hoveredDoc === "gst" && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-50 mt-2 w-96 bg-white border-2 border-blue-300 rounded-lg shadow-2xl p-4"
                                >
                                  <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                                    <div className="text-center">
                                      <svg
                                        className="h-14 w-14 text-gray-400 mx-auto mb-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                      <p className="text-base font-semibold text-gray-700">
                                        GST Certificate
                                      </p>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Document Preview
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Personal Details */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                        className="relative border-t pt-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-6 w-1 bg-gradient-to-b from-violet-600 to-purple-400 rounded-full" />
                          <h3 className="text-base font-semibold text-gray-700">
                            Personal Details
                          </h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 pl-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Name (As Per PAN)
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.nameAsPerPan || selectedShipper.contactPerson}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Date of Birth
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.dobAsPerPan || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              PAN Number
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-mono font-semibold text-violet-600">
                                {selectedShipper.panNumber || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              PAN Document
                            </label>
                            <div
                              className="relative"
                              onMouseEnter={() => setHoveredDoc("pan")}
                              onMouseLeave={() => setHoveredDoc(null)}
                            >
                              <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 px-4 py-3 rounded-lg hover:border-violet-500 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center">
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-700">
                                        PAN_Card.pdf
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Hover to preview
                                      </p>
                                    </div>
                                  </div>
                                  <Eye className="h-5 w-5 text-violet-600" />
                                </div>
                              </div>
                              {hoveredDoc === "pan" && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-50 mt-2 w-96 bg-white border-2 border-violet-300 rounded-lg shadow-2xl p-4"
                                >
                                  <div className="h-56 bg-gradient-to-br from-violet-100 to-purple-200 rounded flex items-center justify-center">
                                    <div className="text-center">
                                      <svg
                                        className="h-14 w-14 text-violet-600 mx-auto mb-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                        />
                                      </svg>
                                      <p className="text-base font-semibold text-gray-700">
                                        PAN Card
                                      </p>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Document Preview
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>

                        </div>
                      </motion.div>

                      {/* Address Details */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="relative border-t pt-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-6 w-1 bg-gradient-to-b from-orange-600 to-rose-400 rounded-full" />
                          <h3 className="text-base font-semibold text-gray-700">
                            Address Details
                          </h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 pl-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              State
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.address.state}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              City
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.address.city}
                              </p>
                            </div>
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Address
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.address.address}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              PIN Code
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-mono font-semibold text-orange-600">
                                {selectedShipper.address.zipCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Business Details */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                        className="relative border-t pt-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-6 w-1 bg-gradient-to-b from-emerald-600 to-teal-400 rounded-full" />
                          <h3 className="text-base font-semibold text-gray-700">
                            Business Details
                          </h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 pl-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Years in Business
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.yearsInBusiness || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Monthly Expected Load
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-semibold text-emerald-600">
                                501-600 T
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Primary Contact (POC)
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedShipper.contactPerson}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {selectedShipper.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Second Contact
                            </label>
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                              {selectedShipper.noSecondPoc ? (
                                <p className="text-sm font-medium text-gray-400 italic">No Second Contact</p>
                              ) : (
                                <>
                                  <p className="text-sm font-medium text-gray-700">
                                    {selectedShipper.namePoc || "N/A"}
                                  </p>
                                  {selectedShipper.phonePoc && (
                                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {selectedShipper.phonePoc.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Credit Terms */}
                      {/* <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.95 }}
                    className="relative border-t pt-6"
                  > */}
                      {/* <div className="flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-gradient-to-b from-purple-600 to-pink-400 rounded-full" />
                      <h3 className="text-base font-semibold text-gray-700">
                        Credit Terms
                      </h3>
                    </div> */}
                      {/* <div className="grid gap-6 sm:grid-cols-2 pl-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Payment Terms
                        </label>
                        <select defaultValue="15" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                          <option value="instant">Instant</option>
                          <option value="7">7 Days</option>
                          <option value="10">10 Days</option>
                          <option value="15">15 Days</option>
                          <option value="30">30 Days</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Advance Payment
                        </label>
                        <select defaultValue="80" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                          <option value="90">90%</option>
                          <option value="80">80%</option>
                          <option value="70">70%</option>
                        </select>
                      </div>
                    </div> */}
                      {/* </motion.div> */}

                      {/* Approval & Status Update */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.0 }}
                        className="relative border-t pt-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-6 w-1 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-full" />
                          <h3 className="text-base font-semibold text-gray-700">
                            Approval & Status Update
                          </h3>
                        </div>

                        {/* Success Message */}
                        {updateStatusSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3"
                          >
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-green-800">Status updated successfully!</p>
                              <p className="text-xs text-green-600 mt-0.5">Shipper approval settings have been saved.</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Error Message */}
                        {updateStatusError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl flex items-center gap-3"
                          >
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-800">Update Failed</p>
                              <p className="text-xs text-red-600 mt-0.5">{updateStatusError}</p>
                            </div>
                            <button onClick={() => setUpdateStatusError(null)} className="text-red-400 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2 pl-4">
                          {/* KYC Verified */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              KYC Verified
                            </label>
                            <select
                              value={kycVerified}
                              onChange={(e) => setKycVerified(Number(e.target.value))}
                              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                              <option value={0}>Not Verified</option>
                              <option value={1}>Verified</option>
                            </select>
                          </div>

                          {/* Shipper Percentage */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Advance Payment Percentage (%)
                            </label>
                            <select
                              value={shipperPercentage}
                              onChange={(e) => setShipperPercentage(Number(e.target.value))}
                              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                              <option value={70}>70%</option>
                              <option value={80}>80%</option>
                              <option value={90}>90%</option>
                            </select>
                          </div>

                          {/* Custom Commission */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Custom Commission (₹)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={customeCommission || ""}
                              onChange={(e) => setCustomeCommission(Number(e.target.value))}
                              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              placeholder="Enter price manually"
                            />
                          </div>

                          {/* Payment Terms */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Payment Terms
                            </label>
                            <select
                              value={paymentTerms}
                              onChange={(e) => setPaymentTerms(e.target.value)}
                              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                              <option value="Instant">Instant</option>
                              <option value="7 Days Credit">7 Days Credit</option>
                              <option value="10 Days Credit">10 Days Credit</option>
                              <option value="15 Days Credit">15 Days Credit</option>
                              <option value="30 Days Credit">30 Days Credit</option>
                            </select>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 pl-4 flex items-center gap-3">
                          <Button
                            onClick={handleUpdateStatus}
                            disabled={updateStatusLoading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 shadow-md hover:shadow-lg transition-all"
                          >
                            {updateStatusLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Approve & Update Status
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setKycVerified(0);
                              setShipperPercentage(80);
                              setCustomeCommission(0);
                              setPaymentTerms("15 Days Credit");
                              setUpdateStatusError(null);
                              setUpdateStatusSuccess(false);
                            }}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {viewMode === "shipments" && selectedShipper && (
          <motion.div
            key="shipments"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Back Button */}
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-700">
                        {selectedShipper.companyName}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        All Shipments ({shipperApiLoads.length} {shipperApiLoads.length === 1 ? 'Load' : 'Loads'})
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewProfile(selectedShipper)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Loads List */}
            <div className="grid gap-5">
              {shipperLoadsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading shipments...</p>
                  </div>
                </div>
              ) : shipperLoadsError ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-500">{shipperLoadsError}</p>
                  </CardContent>
                </Card>
              ) : shipperApiLoads.length > 0 ? (
                (() => {
                  const totalShipmentsPages = Math.ceil(shipperApiLoads.length / shipmentsPerPage);
                  const startIdx = (shipmentsPage - 1) * shipmentsPerPage;
                  const endIdx = startIdx + shipmentsPerPage;
                  const paginatedLoads = shipperApiLoads.slice(startIdx, endIdx);

                  return (
                    <>
                      {paginatedLoads.map((load, index) => {
                        const getLoadStatusBadgeClass = (status: string) => {
                          switch (status) {
                            case "open-load": return "bg-blue-100 text-blue-700 border-blue-200";
                            case "in-transit": return "bg-amber-100 text-amber-700 border-amber-200";
                            case "delivered": return "bg-green-100 text-green-700 border-green-200";
                            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
                            default: return "bg-gray-100 text-gray-700 border-gray-200";
                          }
                        };
                        const formatLoadStatus = (status: string) => {
                          switch (status) {
                            case "open-load": return "Open";
                            case "in-transit": return "In Transit";
                            case "delivered": return "Delivered";
                            case "cancelled": return "Cancelled";
                            default: return status;
                          }
                        };
                        return (
                          <motion.div
                            key={load.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="overflow-hidden border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
                              <CardContent className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                      <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-bold text-gray-700">
                                        {load.load_id}
                                      </h3>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1 ${getLoadStatusBadgeClass(load.status)}`}>
                                        {formatLoadStatus(load.status)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      Price
                                    </p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                                      ₹{formatPrice(load.price)}
                                    </p>
                                  </div>
                                </div>

                                {/* Route */}
                                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-5 border border-blue-100">
                                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm flex-1">
                                    <span className="font-semibold text-gray-700">
                                      {load.origin_location}
                                    </span>
                                    <svg
                                      className="h-5 w-5 text-blue-500 flex-shrink-0 hidden sm:block"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                      />
                                    </svg>
                                    <span className="font-semibold text-gray-700">
                                      {load.destination_location}
                                    </span>
                                  </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                  <div className="bg-violet-50 border border-violet-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="h-5 w-5 rounded bg-violet-500 flex items-center justify-center">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                      </div>
                                      <p className="text-xs font-medium text-gray-500">Material</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">{load.material_name || load.material || "N/A"}</p>
                                  </div>
                                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="h-5 w-5 rounded bg-orange-500 flex items-center justify-center">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                      </div>
                                      <p className="text-xs font-medium text-gray-500">Quantity</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">{load.load_qty} (Tonnes)</p>
                                  </div>
                                  <div className="bg-green-50 border border-green-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="h-5 w-5 rounded bg-green-500 flex items-center justify-center">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <p className="text-xs font-medium text-gray-500">Pickup Date</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                      {load.pickup_date
                                        ? (() => {
                                          const date = new Date(load.pickup_date);
                                          const day = date.getUTCDate();
                                          const month = date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
                                          const year = date.getUTCFullYear();
                                          return `${day} ${month} ${year}`;
                                        })()
                                        : "Not Set"}
                                    </p>
                                  </div>
                                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="h-5 w-5 rounded bg-rose-500 flex items-center justify-center">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <p className="text-xs font-medium text-gray-500">Load Time</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                      {load.load_time
                                        ? (() => {
                                          // Check if it's just time format (HH:MM:SS)
                                          if (load.load_time.includes(':') && !load.load_time.includes('T')) {
                                            const [hours24, minutes] = load.load_time.split(':');
                                            let hours = parseInt(hours24);
                                            const ampm = hours >= 12 ? 'pm' : 'am';
                                            hours = hours % 12;
                                            hours = hours ? hours : 12;
                                            return `${hours}:${minutes} ${ampm}`;
                                          }
                                          // Otherwise parse as date
                                          const date = new Date(load.load_time);
                                          let hours = date.getUTCHours();
                                          const minutes = date.getUTCMinutes();
                                          const ampm = hours >= 12 ? 'pm' : 'am';
                                          hours = hours % 12;
                                          hours = hours ? hours : 12;
                                          const minutesStr = minutes < 10 ? '0' + minutes : minutes;
                                          return `${hours}:${minutesStr} ${ampm}`;
                                        })()
                                        : "Not Set"}
                                    </p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                                    onClick={() => handleViewLoadDetail(load)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Load Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                                    onClick={() => handleViewBids(load)}
                                  >
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    View Bids ({load.total_bids || load.bid_count || 0})
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                      if (selectedShipper?.phone) {
                                        window.location.href = `tel:${selectedShipper.phone}`;
                                      }
                                    }}
                                  >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}

                      {/* Pagination */}
                      {totalShipmentsPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                          <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-800">{startIdx + 1}</span> to <span className="font-semibold text-gray-800">{Math.min(endIdx, shipperApiLoads.length)}</span> of <span className="font-semibold text-gray-800">{shipperApiLoads.length}</span> loads
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShipmentsPage(1)}
                              disabled={shipmentsPage === 1}
                              className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShipmentsPage(p => Math.max(1, p - 1))}
                              disabled={shipmentsPage === 1}
                              className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="text-sm font-medium text-gray-500 px-4">
                              Page <span className="text-gray-900">{shipmentsPage}</span> of <span className="text-gray-900">{totalShipmentsPages}</span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShipmentsPage(p => Math.min(totalShipmentsPages, p + 1))}
                              disabled={shipmentsPage === totalShipmentsPages}
                              className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShipmentsPage(totalShipmentsPages)}
                              disabled={shipmentsPage === totalShipmentsPages}
                              className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No shipments found for this shipper
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {viewMode === "load-detail" && selectedShipper && (
          <motion.div
            key="load-detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Back Button */}
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {loadDetailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading load details...</p>
                </div>
              </div>
            ) : loadDetailError ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-500">{loadDetailError}</p>
                </CardContent>
              </Card>
            ) : loadDetail ? (
              <>
                {/* Load Details Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="overflow-hidden border-2 border-indigo-100">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Package className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-white">
                              {loadDetail.load_id}
                            </h1>
                            <p className="text-indigo-100 mt-1">
                              {selectedShipper.companyName}
                            </p>
                            <p className="text-indigo-200 text-xs mt-1">
                              Shipper ID: {loadDetail.user_id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {(() => {
                            const statusConfig: Record<string, { bg: string; label: string }> = {
                              "open-load": { bg: "bg-blue-500", label: "Open" },
                              "in-transit": { bg: "bg-amber-500", label: "In Transit" },
                              "delivered": { bg: "bg-emerald-500", label: "Delivered" },
                              "cancelled": { bg: "bg-red-500", label: "Cancelled" },
                            };
                            const cfg = statusConfig[loadDetail.status] || { bg: "bg-gray-500", label: loadDetail.status };
                            return (
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${cfg.bg} text-white text-sm font-semibold mb-2`}>
                                {cfg.label}
                              </div>
                            );
                          })()}
                          <p className="text-3xl font-bold text-white">
                            ₹{parseFloat(loadDetail.price).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-indigo-100 uppercase tracking-wide mt-1">
                            Price
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Route Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        Route Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">Pickup</h3>
                          </div>
                          <p className="text-base font-semibold text-gray-700">
                            {loadDetail.origin_location}
                          </p>
                          {loadDetail.exact_origin_location && (
                            <p className="text-sm text-gray-600 mt-2 bg-white/60 p-2 rounded border border-green-100">
                              <span className="text-xs font-semibold text-green-600 uppercase">Exact: </span>
                              {loadDetail.exact_origin_location}
                            </p>
                          )}
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 p-5 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">Drop</h3>
                          </div>
                          <p className="text-base font-semibold text-gray-700">
                            {loadDetail.destination_location}
                          </p>
                          {loadDetail.exact_destination_location && (
                            <p className="text-sm text-gray-600 mt-2 bg-white/60 p-2 rounded border border-rose-100">
                              <span className="text-xs font-semibold text-rose-600 uppercase">Exact: </span>
                              {loadDetail.exact_destination_location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Vehicle Requirements */}
                {(loadDetail.vehicle_body || loadDetail.vehicle_type) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      {loadDetail.vehicle_body && (
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Body Type</p>
                            </div>
                            <p className="text-xl font-bold text-gray-700 capitalize">
                              {loadDetail.vehicle_body}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      {loadDetail.vehicle_type && (
                        <Card className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border-2 border-fuchsia-200">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-lg bg-fuchsia-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Type</p>
                            </div>
                            <p className="text-xl font-bold text-gray-700">
                              {loadDetail.vehicle_type.trim()}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      {loadDetail.container_feet && (
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-lg bg-amber-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Container Size</p>
                            </div>
                            <p className="text-xl font-bold text-gray-700">
                              {loadDetail.container_feet} ft
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Load Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Material</p>
                        </div>
                        <p className="text-base font-bold text-gray-700">{loadDetail.material}</p>
                        <p className="text-sm text-gray-600 mt-1">Qty: {loadDetail.load_qty}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Material Qty</p>
                        </div>
                        <p className="text-xl font-bold text-gray-700">{loadDetail.material_quantity}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pickup Date</p>
                        </div>
                        <p className="text-xl font-bold text-gray-700">
                          {loadDetail.pickup_date
                            ? new Date(loadDetail.pickup_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "Not Set"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Load Time</p>
                        </div>
                        <p className="text-xl font-bold text-gray-700">
                          {loadDetail.load_time
                            ? new Date(loadDetail.load_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
                            : "Not Set"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* Additional Info - ODC, Settled By */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.37 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-slate-600 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                              </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Over Dimensional Cargo (ODC)</p>
                          </div>
                          <p className="text-lg font-bold text-gray-700">
                            {loadDetail.odc || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Settled By</p>
                          </div>
                          <p className="text-lg font-bold text-gray-700">
                            {loadDetail.setteled_by || "Not Settled"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Pricing Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        Pricing Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Price</p>
                          <p className="text-2xl font-bold text-green-700 mt-1">
                            ₹{parseFloat(loadDetail.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Advance Price</p>
                          <p className="text-2xl font-bold text-blue-700 mt-1">
                            ₹{parseFloat(loadDetail.adv_price).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Settled Price</p>
                          <p className="text-2xl font-bold text-purple-700 mt-1">
                            ₹{parseFloat(loadDetail.setteled_price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Timestamps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-1 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-full" />
                        <h3 className="text-base font-semibold text-gray-700">Timeline</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                            <p className="text-sm font-medium text-gray-700">
                              {loadDetail.created_at
                                ? new Date(loadDetail.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Last Updated</p>
                            <p className="text-sm font-medium text-gray-700">
                              {loadDetail.updated_at
                                ? new Date(loadDetail.updated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : null}
          </motion.div>
        )}

        {/* Trucker Bids View - Only shown when viewing bids */}
        {viewMode === "bids" && selectedLoad && selectedShipper && (
          <motion.div
            key="bids"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="text-sm text-gray-600">
                {loadBids.length} {loadBids.length === 1 ? "bid" : "bids"}{" "}
                received
              </div>
            </div>

            {/* Load Requirements Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-700">
                      {selectedLoad?.loadNumber || loadDetail?.load_id || "N/A"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Bids for this load
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Load Value
                    </p>
                    <p className="text-2xl font-bold text-gray-700">
                      ₹{parseFloat(loadDetail?.price || selectedLoad?.revenue || "0").toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                      Material
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {loadDetail?.material || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">
                      Quantity: {loadDetail?.load_qty || "N/A"}
                    </p>
                  </div>

                  {(loadDetail?.vehicle_body || loadDetail?.vehicle_type) && (
                    <>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          Vehicle Body Type
                        </p>
                        <p className="text-sm font-bold text-gray-700 capitalize">
                          {loadDetail?.vehicle_body || "N/A"}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                          Vehicle Type
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {loadDetail?.vehicle_type || "N/A"}
                        </p>
                      </div>

                      {loadDetail?.container_feet && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                            Container Size
                          </p>
                          <p className="text-sm font-bold text-gray-700">
                            {loadDetail.container_feet} ft
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bids List */}
            <div className="space-y-4">
              {loadBids.length > 0 ? (
                <>
                  {loadBids.map((bid, index) => {
                    const isBestBid = index === 0 && bid.status === "pending";
                    return (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="relative overflow-hidden">
                          {isBestBid && (
                            <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden z-10">
                              {/* Diagonal ribbon */}
                              <div className="absolute top-6 -right-8 w-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center font-bold text-sm py-2 transform rotate-45 shadow-lg">
                                BEST BID
                              </div>
                            </div>
                          )}
                          <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-bold text-gray-700">
                                    {bid.truckerName}
                                  </h3>
                                  <Badge
                                    variant={getStatusBadge(bid.status) as any}
                                  >
                                    {bid.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {bid.truckerCompany}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Bid Amount
                                </p>
                                <p className="text-xl font-bold text-gray-700">
                                  {formatCurrency(counterOffers[bid.id] || bid.bidAmount)}
                                </p>
                                {counterOffers[bid.id] && (
                                  <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                                    Counter Offer
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t mb-3" />

                            {/* Details Grid */}
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-2">
                              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Truck Type
                                </p>
                                <p className="text-sm font-semibold text-gray-700 capitalize">
                                  {bid.truckType.replace("-", " ")}
                                </p>
                              </div>

                              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Truck Number
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {bid.truckNumber}
                                </p>
                              </div>

                              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Driver
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {bid.driverName}
                                </p>
                              </div>

                              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  GST Number
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {bid.gstNumber || "N/A"}
                                </p>
                              </div>
                            </div>

                            {/* Contact */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{bid.driverPhone}</span>
                            </div>

                            {/* Notes */}
                            {bid.notes && (
                              <div className="p-2 rounded bg-blue-50 border border-blue-100 mb-2">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-700">
                                  {bid.notes}
                                </p>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>
                                  Submitted: {formatDateTime(bid.submittedAt)}
                                </span>
                                <span>
                                  Valid until: {formatDateTime(bid.validUntil)}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCounterDialogOpen(bid.id);
                                    setCounterAmount((counterOffers[bid.id] || bid.bidAmount).toString());
                                  }}
                                  className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                >
                                  <DollarSign className="mr-1 h-3 w-3" />
                                  Counter
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <Phone className="mr-1 h-3 w-3" />
                                  Call
                                </Button>
                              </div>

                              {/* Counter Offer Dialog */}
                              {counterDialogOpen === bid.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                                >
                                  <p className="text-xs font-semibold text-indigo-900 mb-2">Counter Offer</p>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <input
                                        type="number"
                                        value={counterAmount}
                                        onChange={(e) => setCounterAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full h-8 px-3 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      />
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const newAmount = parseInt(counterAmount);
                                        if (!isNaN(newAmount)) {
                                          setCounterOffers({
                                            ...counterOffers,
                                            [bid.id]: newAmount
                                          });
                                        }
                                        setCounterDialogOpen(null);
                                        setCounterAmount("");
                                      }}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs"
                                    >
                                      Submit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setCounterDialogOpen(null);
                                        setCounterAmount("");
                                      }}
                                      className="border-gray-300 h-8 text-xs"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No bids received for this load yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
