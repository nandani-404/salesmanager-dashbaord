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
  DollarSign,
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

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Helper function to format time consistently
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

// Helper function to format price consistently (Indian format with commas)
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toLocaleString('en-IN');
};

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            Back
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
          Back
        </Button>
      </motion.div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{load.load_id}</h1>
                  <p className="text-gray-600 text-sm">
                    {load.shipper_name || "Shipper"}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-500 text-xs">
                      {load.user_id}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-gray-500 text-xs">
                      {mounted ? `${formatDate(load.created_at)}, ${formatTime(load.created_at)}` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(load.status)} text-white mb-2`}>
                  {load.status}
                </span>
                <p className="text-4xl font-bold text-gray-900">₹{mounted ? formatPrice(load.price) : '...'}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider">PRICE</p>
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
        <Card className="border-gray-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Route Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pickup */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-700 uppercase">Pickup</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {load.origin_location || load.exact_origin_location}
                </p>
                {load.exact_origin_location && load.exact_origin_location !== load.origin_location && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">EXACT:</p>
                    <p className="text-xs text-gray-700">{load.exact_origin_location}</p>
                  </div>
                )}
              </div>

              {/* Drop */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-bold text-gray-700 uppercase">Drop</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {load.destination_location || load.exact_destination_location}
                </p>
                {load.exact_destination_location && load.exact_destination_location !== load.destination_location && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">EXACT:</p>
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
        <Card className="bg-gray-50 border-gray-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">BODY TYPE</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {load.vehicle_body || "N/A"}
            </p>
          </div>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">VEHICLE TYPE</span>
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
        <Card className="bg-gray-50 border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase">MATERIAL</span>
            </div>
            <p className="text-base font-bold text-gray-900">{load.material || "N/A"}</p>
          </div>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase">MATERIAL QTY</span>
            </div>
            <p className="text-base font-bold text-gray-900">{load.material_quantity || load.load_qty || "N/A"} (Tonnes)</p>
          </div>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase">PICKUP DATE</span>
            </div>
            <p className="text-base font-bold text-gray-900">
              {load.pickup_date && mounted
                ? formatDate(load.pickup_date)
                : load.pickup_date ? "Loading..." : "N/A"}
            </p>
          </div>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600 font-bold uppercase">LOAD TIME</span>
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

      {/* Pricing Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-gray-200">
          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Pricing Breakdown
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gray-50 border-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-bold uppercase mb-2">TOTAL PRICE</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{mounted ? formatPrice(load.price) : '...'}
                  </p>
                </div>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-bold uppercase mb-2">ADVANCE PRICE</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{mounted ? (load.adv_price ? formatPrice(load.adv_price) : "0") : '...'}
                  </p>
                </div>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-bold uppercase mb-2">SETTLED PRICE</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{mounted ? (load.setteled_price ? formatPrice(load.setteled_price) : formatPrice(load.price)) : '...'}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
