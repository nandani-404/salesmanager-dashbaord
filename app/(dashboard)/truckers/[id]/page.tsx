"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, User, Mail, Phone, Eye, Package, Building2,
  FileText, Check, X, Truck, Calendar, MapPin, CreditCard,
  Globe, Star, ShieldCheck, Loader2, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, BASE_URL } from "@/config/page";

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
  images: string | null;
}

export default function TruckerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const truckerId = params.id as string;

  const [trucker, setTrucker] = useState<TruckerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState(false);
  const [updateStatusError, setUpdateStatusError] = useState<string | null>(null);
  const [kycVerified, setKycVerified] = useState<number>(0);

  useEffect(() => {
    const fetchTruckerDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ trucker: TruckerDetail }>(
          API_ENDPOINTS.dashboard.truckerDetail(truckerId)
        );
        console.log('Trucker verified_trucker_shipper:', response.data.trucker.verified_trucker_shipper);
        setTrucker(response.data.trucker);
        // Initialize kycVerified state with actual value from API
        setKycVerified(parseInt(response.data.trucker.verified_trucker_shipper || "0"));
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch trucker details:", err);
        setError(err.response?.data?.message || err.message || "Failed to load trucker details");
      } finally {
        setLoading(false);
      }
    };

    if (truckerId) {
      fetchTruckerDetail();
    }
  }, [truckerId]);

  const handleUpdateStatus = async () => {
    if (!trucker) return;
    
    setUpdateStatusLoading(true);
    setUpdateStatusError(null);
    setUpdateStatusSuccess(false);
    
    try {
      await apiClient.post(
        API_ENDPOINTS.dashboard.truckerUpdateStatus(trucker.id),
        { verified_trucker_shipper: kycVerified }
      );
      
      setUpdateStatusSuccess(true);
      
      // Update local trucker state
      setTrucker({
        ...trucker,
        verified_trucker_shipper: kycVerified.toString()
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setUpdateStatusSuccess(false), 5000);
    } catch (err: any) {
      console.error("Failed to update trucker status:", err);
      setUpdateStatusError(
        err?.response?.data?.message || err?.message || "Failed to update status"
      );
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <h3 className="text-lg font-bold text-gray-800">Loading Trucker Details...</h3>
      </div>
    );
  }

  if (error || !trucker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-500">{error || "Trucker not found"}</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
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
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6" suppressHydrationWarning>
              <div className="flex items-start gap-6 mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden"
                >
                  {trucker.images ? (
                    <img 
                      src={`${BASE_URL}/public/${trucker.images}`} 
                      alt={trucker.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {(trucker.transport_name || trucker.name).substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-700">
                    {trucker.transport_name || trucker.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {trucker.unique_id}
                  </p>
                  <p className="text-gray-600 mt-1 font-medium">
                    {trucker.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {trucker.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">
                          {trucker.email.replace(/(.{2})(.*)(@.*)/, '$1****$3')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">
                        {trucker.mobile.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total Vehicles
                  </p>
                  <p className="text-lg font-bold text-blue-700 mt-1">
                    {trucker.total_vehicles || "0"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Fleet Size
                  </p>
                  <p className="text-lg font-bold text-orange-700 mt-1">
                    {trucker.Fleet_Size || "N/A"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Established
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-1">
                    {trucker.Year_of_Establishment || "N/A"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                  onClick={() => window.location.href = `tel:${trucker.mobile}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button
                  onClick={() => router.push(`/truckers/${truckerId}/vehicles`)}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Truck className="mr-2 h-4 w-4" />
                  View Trucks
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KYC Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                KYC Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* Company Registration */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
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
                        Registration Number
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-medium text-gray-700">
                          {trucker.Registered_ID || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        GST Number
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-mono font-semibold text-blue-600">
                          {trucker.GST_Number || "N/A"}
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
                                <FileText className="h-5 w-5 text-white" />
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
                        {hoveredDoc === "gst" && trucker.GST_Certificate && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-blue-300 rounded-lg shadow-2xl p-4"
                          >
                            <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center overflow-hidden">
                              <img 
                                src={`${BASE_URL}/public/${trucker.GST_Certificate}`}
                                alt="GST Certificate"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </motion.div>
                        )}
                        {hoveredDoc === "gst" && !trucker.GST_Certificate && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-blue-300 rounded-lg shadow-2xl p-4"
                          >
                            <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="h-14 w-14 text-gray-400 mx-auto mb-3" />
                                <p className="text-base font-semibold text-gray-700">
                                  GST Certificate
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  No document uploaded
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
                  transition={{ duration: 0.3, delay: 0.4 }}
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
                          {trucker.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        PAN Number
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-mono font-semibold text-violet-600">
                          {trucker.PAN_Number || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 relative sm:col-span-2">
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
                                <FileText className="h-5 w-5 text-white" />
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
                        {hoveredDoc === "pan" && trucker.PAN_Image && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-violet-300 rounded-lg shadow-2xl p-4"
                          >
                            <div className="h-56 bg-gradient-to-br from-violet-100 to-purple-200 rounded flex items-center justify-center overflow-hidden">
                              <img 
                                src={`${BASE_URL}/public/${trucker.PAN_Image}`}
                                alt="PAN Card"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </motion.div>
                        )}
                        {hoveredDoc === "pan" && !trucker.PAN_Image && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-violet-300 rounded-lg shadow-2xl p-4"
                          >
                            <div className="h-56 bg-gradient-to-br from-violet-100 to-purple-200 rounded flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="h-14 w-14 text-violet-600 mx-auto mb-3" />
                                <p className="text-base font-semibold text-gray-700">
                                  PAN Card
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  No document uploaded
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
                  transition={{ duration: 0.3, delay: 0.5 }}
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
                          {trucker.state_name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        City
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-medium text-gray-700">
                          {trucker.city || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Address
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-medium text-gray-700">
                          {trucker.address || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        PIN Code
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-mono font-semibold text-orange-600">
                          {trucker.pincode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Years in Business
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-medium text-gray-700">
                      {trucker.Year_of_Establishment || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Fleet Size
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-semibold text-emerald-600">
                      {trucker.Fleet_Size || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Established Year
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Since {trucker.Year_of_Establishment || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bank Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Bank Name
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-medium text-gray-700">
                      {trucker.bank_name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Account Number
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-mono font-semibold text-purple-600">
                      {trucker.account_number || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    IFSC Code
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-mono font-semibold text-gray-700">
                      {trucker.ifsc_code || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Branch
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-medium text-gray-700">
                      {trucker.branch_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credit Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                Credit Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Advance Payment
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-bold text-orange-600">
                      90% (Fixed)
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Balance Payment
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-medium text-gray-700">
                      On Delivery
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Approve Trucker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                Approve Trucker
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800">Status Updated Successfully!</p>
                    <p className="text-xs text-green-600 mt-0.5">Trucker verification status has been saved.</p>
                  </div>
                  <button onClick={() => setUpdateStatusSuccess(false)} className="text-green-400 hover:text-green-600">
                    <X className="h-4 w-4" />
                  </button>
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

              <div className="space-y-4">
                {/* KYC Verified Dropdown */}
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

                {/* Submit Button */}
                <div className="flex items-center gap-3">
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
                        Update Status
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setKycVerified(0);
                      setUpdateStatusError(null);
                      setUpdateStatusSuccess(false);
                    }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
