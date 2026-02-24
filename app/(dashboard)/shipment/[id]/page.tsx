"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Package,
  Loader2,
  AlertCircle,
  Truck,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/config/page";

interface LoadDetailFull {
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
  shipper_name?: string;
}

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [load, setLoad] = useState<LoadDetailFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadDetail = async () => {
      try {
        setLoading(true);
        // Try to fetch detailed load information
        const response = await apiClient.get<any>(`${API_ENDPOINTS.dashboard.shipmentsLoads}`);
        const loads = response.data?.loads || [];
        
        // Find the specific load
        const foundLoad = loads.find((l: any) => l.id.toString() === id.toString());
        
        if (foundLoad) {
          // Try to get more detailed information if available
          try {
            const detailResponse = await apiClient.get<any>(
              `${API_ENDPOINTS.dashboard.shipperLoadDetail(foundLoad.user_id, foundLoad.id)}`
            );
            const detailedLoad = detailResponse.data?.load_details || detailResponse.data;
            setLoad({ ...foundLoad, ...detailedLoad });
          } catch {
            // If detailed endpoint fails, use basic load data
            setLoad(foundLoad);
          }
          setError(null);
        } else {
          setError("Load not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch load details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLoadDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading load details...</p>
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Load Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The load you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/shipment")} className="bg-blue-600 hover:bg-blue-700">
            Back to Shipments
          </Button>
        </Card>
      </div>
    );
  }

  // Format status badge
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "in-transit":
        return "bg-blue-500";
      case "delivered":
        return "bg-emerald-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="space-y-4 pb-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/shipment")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Shipments
        </Button>
      </motion.div>

      {/* Purple Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{load.load_id}</h1>
                  <p className="text-purple-100 text-sm">
                    {load.shipper_name || "Shipper"}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Shipper ID: {load.user_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(load.status)} text-white mb-2`}>
                  {load.status}
                </span>
                <p className="text-4xl font-bold">₹{parseFloat(load.price).toLocaleString('en-IN')}</p>
                <p className="text-purple-200 text-xs uppercase tracking-wider">PRICE</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Route Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Route Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pickup */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-green-700 uppercase">Pickup</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {load.origin_location || load.exact_origin_location}
                </p>
                {load.exact_origin_location && load.exact_origin_location !== load.origin_location && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p className="text-xs text-green-700 font-medium mb-1">EXACT:</p>
                    <p className="text-xs text-gray-700">{load.exact_origin_location}</p>
                  </div>
                )}
              </div>

              {/* Drop */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-red-700 uppercase">Drop</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {load.destination_location || load.exact_destination_location}
                </p>
                {load.exact_destination_location && load.exact_destination_location !== load.destination_location && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <p className="text-xs text-red-700 font-medium mb-1">EXACT:</p>
                    <p className="text-xs text-gray-700">{load.exact_destination_location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Body Type and Vehicle Type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">BODY TYPE</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {load.vehicle_body || "N/A"}
            </p>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-purple-700 font-bold uppercase tracking-wider">VEHICLE TYPE</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {load.vehicle_type || load.container_feet ? `${load.vehicle_type || ""} ${load.container_feet || ""}`.trim() : "N/A"}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Material, Qty, Pickup Date, Load Time */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="bg-purple-50 border-purple-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-purple-600 flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-purple-700 font-bold uppercase">MATERIAL</span>
            </div>
            <p className="text-base font-bold text-gray-900">{load.material || "N/A"}</p>
            <p className="text-xs text-gray-600 mt-1">Qty: {load.load_qty || load.material_quantity || "N/A"}</p>
          </div>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-orange-600 flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-orange-700 font-bold uppercase">MATERIAL QTY</span>
            </div>
            <p className="text-base font-bold text-gray-900">{load.material_quantity || load.load_qty || "N/A"}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-green-600 flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-green-700 font-bold uppercase">PICKUP DATE</span>
            </div>
            <p className="text-base font-bold text-gray-900">
              {load.pickup_date 
                ? new Date(load.pickup_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                : "N/A"}
            </p>
          </div>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-blue-700 font-bold uppercase">LOAD TIME</span>
            </div>
            <p className="text-base font-bold text-gray-900">
              {load.load_time ? (() => {
                try {
                  // Extract time from ISO format (e.g., "2026-02-24T10:52:00.000000Z" -> "10:52")
                  if (load.load_time.includes('T')) {
                    const timePart = load.load_time.split('T')[1];
                    const [hours, minutes] = timePart.split(':');
                    return `${hours}:${minutes}`;
                  }
                  // If already in simple format, return as is
                  return load.load_time;
                } catch {
                  return load.load_time;
                }
              })() : "N/A"}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white border-gray-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-700 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Additional Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-teal-50 border-teal-200">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-teal-600 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs text-teal-700 font-bold uppercase">OVER DIMENSIONAL CARGO (ODC)</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{load.odc || "N/A"}</p>
                </div>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs text-purple-700 font-bold uppercase">SETTLED BY</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{load.setteled_by || "31"}</p>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pricing Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-green-50 border-green-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              Pricing Breakdown
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-green-100 border-green-300">
                <div className="p-4">
                  <p className="text-xs text-green-700 font-bold uppercase mb-2">TOTAL PRICE</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{parseFloat(load.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </Card>

              <Card className="bg-blue-100 border-blue-300">
                <div className="p-4">
                  <p className="text-xs text-blue-700 font-bold uppercase mb-2">ADVANCE PRICE</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{load.adv_price ? parseFloat(load.adv_price).toLocaleString('en-IN') : "0"}
                  </p>
                </div>
              </Card>

              <Card className="bg-purple-100 border-purple-300">
                <div className="p-4">
                  <p className="text-xs text-purple-700 font-bold uppercase mb-2">SETTLED PRICE</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ₹{load.setteled_price ? parseFloat(load.setteled_price).toLocaleString('en-IN') : parseFloat(load.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white border-gray-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              Timeline
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">CREATED</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(load.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}, {new Date(load.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">LAST UPDATED</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(load.updated_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}, {new Date(load.updated_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
