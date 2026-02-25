"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, MapPin, Building2, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";

interface ShipperDetail {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  unique_id: string;
  state_name: string;
  company_name: string;
  company_registration_type: string;
  years_in_business: string;
  kyc_verified: number;
  status: string;
  load_count: number;
  profile_created_at: string;
}

export default function ShipperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [shipper, setShipper] = useState<ShipperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipperDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<any>(`/api/dashboard/shipper/${id}`);
        console.log("Shipper detail response:", response.data);
        
        if (response.data?.shipper) {
          setShipper(response.data.shipper);
        }
      } catch (err: any) {
        console.error("Failed to fetch shipper details:", err);
        setError(err?.response?.data?.message || "Failed to load shipper details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShipperDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading shipper details...</p>
      </div>
    );
  }

  if (error || !shipper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Shipper</h3>
        <p className="text-gray-500 mb-4">{error || "Shipper not found"}</p>
        <Button onClick={() => router.push("/shippers")} className="bg-blue-600 hover:bg-blue-700">
          Back to Shippers
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
            onClick={() => router.push("/shippers")}
            className="h-9 w-9 p-0 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{shipper.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{shipper.unique_id}</p>
          </div>
        </div>
      </motion.div>

      {/* Shipper Details */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Company Name</p>
            <p className="font-semibold text-gray-900">{shipper.company_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Mobile</p>
            <p className="font-semibold text-gray-900">{shipper.mobile}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">State</p>
            <p className="font-semibold text-gray-900">{shipper.state_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">KYC Status</p>
            <p className={`font-semibold ${shipper.kyc_verified === 1 ? "text-green-600" : "text-yellow-600"}`}>
              {shipper.kyc_verified === 1 ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
            <p className={`font-semibold ${shipper.status === "Active" ? "text-green-600" : "text-gray-600"}`}>
              {shipper.status}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Total Loads</p>
            <p className="font-semibold text-gray-900">{shipper.load_count}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
