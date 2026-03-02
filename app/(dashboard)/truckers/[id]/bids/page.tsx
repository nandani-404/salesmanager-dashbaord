"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/config/page";
import EmptyState from "@/components/ui/EmptyState";

interface TruckerBid {
  id: number;
  post_id: string;
  unique_id: string;
  trucker_id: string;
  name: string;
  Transport_Name: string;
  vehicle_number: string;
  driver_name: string;
  dl_number: string;
  driver_phone: string;
  trucker_price: string;
  created_at: string;
  origin_location?: string;
  destination_location?: string;
  material_name?: string;
  meterial_quantity?: string;
  load_price?: string;
  status?: string;
}

export default function TruckerBidsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [bids, setBids] = useState<TruckerBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truckerName, setTruckerName] = useState<string>("Trucker");
  const [truckerUniqueId, setTruckerUniqueId] = useState<string>("");

  useEffect(() => {
    const fetchTruckerBids = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trucker bids/applications
        try {
          const bidsResponse = await apiClient.get<any>(
            `/api/dashboard/trucker/${id}/applications`
          );

          console.log("Bids API Response:", bidsResponse.data);
          const bidsData = bidsResponse.data?.data || [];
          console.log("Bids Data:", bidsData);
          console.log("First bid unique_id:", bidsData[0]?.unique_id);
          setBids(bidsData);

          // Get TM ID and name from first bid if available
          if (bidsData.length > 0) {
            setTruckerUniqueId(bidsData[0].unique_id || "");
            setTruckerName(bidsData[0].Transport_Name || bidsData[0].name || "Trucker");
          } else {
            // Fallback: Fetch trucker details if no bids
            try {
              const truckerResponse = await apiClient.get<any>(
                API_ENDPOINTS.dashboard.truckerDetail(id)
              );
              if (truckerResponse.data?.trucker) {
                setTruckerName(
                  truckerResponse.data.trucker.transport_name ||
                  truckerResponse.data.trucker.name ||
                  "Trucker"
                );
                setTruckerUniqueId(truckerResponse.data.trucker.unique_id || "");
              }
            } catch (err) {
              console.error("Failed to fetch trucker details:", err);
            }
          }
        } catch (err: any) {
          console.error("Failed to fetch bids:", err);
          // If bids endpoint fails, try to at least get trucker details
          try {
            const truckerResponse = await apiClient.get<any>(
              API_ENDPOINTS.dashboard.truckerDetail(id)
            );
            if (truckerResponse.data?.trucker) {
              setTruckerName(
                truckerResponse.data.trucker.transport_name ||
                truckerResponse.data.trucker.name ||
                "Trucker"
              );
              setTruckerUniqueId(truckerResponse.data.trucker.unique_id || "");
            }
          } catch (detailErr) {
            console.error("Failed to fetch trucker details:", detailErr);
          }
          throw err;
        }
      } catch (err: any) {
        console.error("Failed to fetch trucker bids:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch bids"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTruckerBids();
  }, [id]);

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "confirmed";
      case "rejected":
        return "cancelled";
      case "pending":
        return "pending";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading bids...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Error Loading Bids
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/truckers")}
            className="h-9 w-9 p-0 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trucker Bids</h1>
            <p className="text-sm text-gray-600 mt-1">
              {truckerName} • {truckerUniqueId && `${truckerUniqueId} • `}{bids.length} bid{bids.length !== 1 ? "s" : ""}{" "}
              received
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bids List */}
      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
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
                          Load #{bid.post_id}
                        </h3>
                        {bid.status && (
                          <Badge
                            variant={getStatusBadge(bid.status)}
                            className="mt-1"
                          >
                            {bid.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bid Amount
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                        ₹{parseFloat(bid.trucker_price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  {bid.origin_location && bid.destination_location && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-5 border border-blue-100">
                      <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm flex-1">
                        <span className="font-semibold text-gray-700">
                          {bid.origin_location}
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
                          {bid.destination_location}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Trucker ID
                      </p>
                      <p className="text-sm font-bold text-indigo-700">
                        {bid.unique_id || "N/A"}
                      </p>
                    </div>
                    {bid.material_name && (
                      <div className="bg-violet-50 border border-violet-100 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Material
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {bid.material_name}
                        </p>
                      </div>
                    )}
                    {bid.meterial_quantity && (
                      <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Quantity
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {bid.meterial_quantity}
                        </p>
                      </div>
                    )}
                    {bid.vehicle_number && (
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Truck Number
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {bid.vehicle_number}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Driver Info */}
                  {bid.driver_name && (
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Driver Information
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {bid.driver_name}
                          </p>
                        </div>
                        {bid.driver_phone && (
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {bid.driver_phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Bids Found"
          message="No bids have been placed by this trucker yet"
        />
      )}
    </div>
  );
}
