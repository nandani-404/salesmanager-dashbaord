"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Loader2,
  AlertCircle,
  Navigation,
  Building2,
  Truck,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";

interface AcceptedLoadDetail {
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

export default function LoadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loadId = params.id as string;
  const [load, setLoad] = useState<AcceptedLoadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/dashboard/accepted-loads");
        
        if (response.data.status && response.data.data) {
          const loads = response.data.data;
          const foundLoad = loads.find((l: AcceptedLoadDetail) => l.load_id.toString() === loadId);
          
          if (foundLoad) {
            setLoad(foundLoad);
          } else {
            setError("Load not found");
          }
        } else {
          setError("Failed to fetch load details");
        }
      } catch (err: any) {
        console.error("Error fetching load details:", err);
        setError(err.response?.data?.message || "Failed to fetch load details");
      } finally {
        setLoading(false);
      }
    };

    if (loadId) {
      fetchLoadDetail();
    }
  }, [loadId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading load details...</p>
        </div>
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Load Not Found</h2>
          <p className="mt-2 text-gray-600">{error || "The load you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/loads")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Load ID and Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/loads")}
            className="h-10 w-10 p-0 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Load #{load.load_id}</h1>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                Accepted
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Accepted Load Details</p>
          </div>
        </div>
      </motion.div>

      {/* Pricing Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Pricing Summary</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Final Shipper Price</p>
                <p className="text-3xl font-bold text-gray-900">₹{load.shipper_price.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Final Trucker Price</p>
                <p className="text-3xl font-bold text-gray-900">₹{load.trucker_price.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Commission</p>
                <p className="text-3xl font-bold text-green-600">₹{load.commission.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Parties Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipper Information */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Shipper Information</h3>
                  <p className="text-xs text-gray-500">Client Details</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Company Name</p>
                  <p className="text-base font-bold text-gray-900">{load.company_name}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trucker Information */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Trucker Information</h3>
                  <p className="text-xs text-gray-500">Transport Details</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Transport Company</p>
                  <p className="text-base font-bold text-gray-900">{load.transport_name}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Load Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Load Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Origin */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-bold text-green-700 uppercase">Origin</p>
                </div>
                <p className="text-base font-semibold text-gray-900">{load.origin_location}</p>
              </div>

              {/* Destination */}
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-bold text-red-700 uppercase">Destination</p>
                </div>
                <p className="text-base font-semibold text-gray-900">{load.destination_location}</p>
              </div>

              {/* Material */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-bold text-purple-700 uppercase">Material</p>
                </div>
                <p className="text-base font-semibold text-gray-900">{load.material_name}</p>
              </div>

              {/* Pickup Date */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-bold text-blue-700 uppercase">Pickup Date</p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {load.picup_date ? formatDate(load.picup_date) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
