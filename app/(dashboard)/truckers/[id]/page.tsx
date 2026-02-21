"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, User, Mail, Phone, Eye, Package, Building2,
  FileText, Check, X, Truck, Calendar, MapPin, CreditCard,
  Globe, Star, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TruckerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const truckerId = params.id as string;

  // Mock Data
  const trucker = {
    id: truckerId,
    name: "Prince Singh",
    companyName: "Singh Express Carriers",
    truckerId: "TM2507KA03136",
    email: "prince.singh@singhexpress.com",
    mobile: "+91 98765 43210",
    alternatePhone: "+91 98765 43211",

    yearsInBusiness: "5-10 years",
    fleetSize: "10-20 trucks",
    officeAddress: "Plot No. 45, Transport Nagar",
    state: "Karnataka",
    city: "Bangalore",
    pinCode: "560058",
    registrationNumber: "KA-2018-SEC-123456",
    establishedYear: "2015",
    bankName: "HDFC Bank",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234",
    branchName: "Koramangala",
    pan: "ABCPS1234D",
    gst: "29ABCPS1234D1Z5",
    totalVehicles: 15,
    completedLoads: 342,
    rating: 4.8,
    activeLoads: 8,
    status: "pending_approval", // pending_approval, active, inactive
  };

  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

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
            Back to Truckers
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <span className="text-3xl font-bold text-white">
                    {trucker.companyName.substring(0, 2).toUpperCase()}
                  </span>
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-700">
                    {trucker.companyName}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {trucker.truckerId}
                  </p>
                  <p className="text-gray-600 mt-1 font-medium">
                    {trucker.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${trucker.email}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {trucker.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${trucker.mobile}`}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        {trucker.mobile}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total Vehicles
                  </p>
                  <p className="text-lg font-bold text-blue-700 mt-1">
                    {trucker.totalVehicles}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Active Loads
                  </p>
                  <p className="text-lg font-bold text-orange-700 mt-1">
                    {trucker.activeLoads}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Completed Loads
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-1">
                    {trucker.completedLoads}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Rating
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="text-lg font-bold ml-1 text-gray-800">{trucker.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                  onClick={() => window.location.href = `mailto:${trucker.email}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
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
                          {trucker.registrationNumber}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        GST Number
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-mono font-semibold text-blue-600">
                          {trucker.gst}
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
                                <FileText className="h-14 w-14 text-gray-400 mx-auto mb-3" />
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
                          {trucker.pan}
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
                                <FileText className="h-14 w-14 text-violet-600 mx-auto mb-3" />
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
                          {trucker.state}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        City
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-medium text-gray-700">
                          {trucker.city}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Address
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-medium text-gray-700">
                          {trucker.officeAddress}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        PIN Code
                      </label>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                        <p className="text-sm font-mono font-semibold text-orange-600">
                          {trucker.pinCode}
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
                      {trucker.yearsInBusiness}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Fleet Size
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-semibold text-emerald-600">
                      {trucker.fleetSize}
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
                        Since {trucker.establishedYear}
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
                      {trucker.bankName}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Account Number
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-mono font-semibold text-purple-600">
                      {trucker.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    IFSC Code
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-mono font-semibold text-gray-700">
                      {trucker.ifscCode}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Branch
                  </label>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                    <p className="text-sm font-medium text-gray-700">
                      {trucker.branchName}
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

        {/* Status & Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-full" />
                <h3 className="text-base font-semibold text-gray-700">
                  Account Status
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-sm">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Pending Approval
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Reject
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
  )
}
