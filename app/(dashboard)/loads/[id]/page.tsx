"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockLoads } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Phone,
  FileText,
  Clock,
  Weight,
  Box,
  AlertCircle,
  Navigation,
  Building2,
  User,
  Truck,
  Hash,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loadId = params.id as string;

  const load = mockLoads.find((l) => l.id === loadId);

  // Mock accepted load data with all required fields
  const acceptedLoadData = {
    loadId: load?.loadNumber || "TMLD001",
    shipperCompanyName: load?.shipperName || "Bharat Logistics Pvt Ltd",
    finalShipperPrice: load?.revenue || 350000,
    finalTruckerPrice: 340000,
    shipperName: "Ramesh Patel",
    truckerName: "Rajesh Kumar",
    truckerCompany: "Kumar Transport Services",
    assignedDriverName: "Amit Singh",
    driverLicenseNumber: "DL-0320230012345",
    driverPhoneNumber: "+91-98765-43210",
    vehicleBodyType: "Closed Body",
    vehicleType: "32 ft Container",
    truckNumber: "MH-02-AB-1234",
  };

  if (!load) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Load Not Found</h2>
          <p className="mt-2 text-gray-600">The load you're looking for doesn't exist.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">{acceptedLoadData.loadId}</h1>
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
                <p className="text-3xl font-bold text-gray-900">₹{acceptedLoadData.finalShipperPrice.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Final Trucker Price</p>
                <p className="text-3xl font-bold text-gray-900">₹{acceptedLoadData.finalTruckerPrice.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Margin</p>
                <p className="text-3xl font-bold text-green-600">₹{(acceptedLoadData.finalShipperPrice - acceptedLoadData.finalTruckerPrice).toLocaleString('en-IN')}</p>
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
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.shipperCompanyName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact Person</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.shipperName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Shipper ID</p>
                  <p className="text-base font-bold text-gray-900">{load.shipperId}</p>
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
                  <p className="text-xs text-gray-500">Transporter Details</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Company Name</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.truckerCompany}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Trucker Name</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.truckerName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Truck Number</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.truckNumber}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Driver Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Assigned Driver</h3>
                <p className="text-xs text-gray-500">Driver Details</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Driver Name</p>
                <p className="text-base font-bold text-gray-900">{acceptedLoadData.assignedDriverName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">License Number</p>
                <p className="text-base font-bold text-gray-900">{acceptedLoadData.driverLicenseNumber}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                <p className="text-base font-bold text-gray-900">{acceptedLoadData.driverPhoneNumber}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Route Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Route Details</h3>
                <p className="text-xs text-gray-500">Pickup & Delivery</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Pickup Location</p>
                </div>
                <div className="pl-10 space-y-2">
                  <p className="font-semibold text-gray-900">{load.origin.city}, {load.origin.state}</p>
                  <p className="text-sm text-gray-600">{load.origin.address}</p>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(load.pickupDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{load.pickupTime || "TBD"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-rose-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Delivery Location</p>
                </div>
                <div className="pl-10 space-y-2">
                  <p className="font-semibold text-gray-900">{load.destination.city}, {load.destination.state}</p>
                  <p className="text-sm text-gray-600">{load.destination.address}</p>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(load.deliveryDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{load.deliveryTime || "TBD"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Vehicle & Cargo Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Vehicle Details</h3>
                  <p className="text-xs text-gray-500">Assigned Vehicle</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Body Type</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.vehicleBodyType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vehicle Type</p>
                  <p className="text-base font-bold text-gray-900">{acceptedLoadData.vehicleType}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Cargo Details */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cargo Details</h3>
                  <p className="text-xs text-gray-500">Material Information</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Material Type</p>
                  <p className="text-base font-bold text-gray-900">{load.cargo.type}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Quantity</p>
                  <p className="text-base font-bold text-gray-900">{load.cargo.quantity} Units</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Weight</p>
                  <p className="text-base font-bold text-gray-900">{(load.cargo.weight / 1000).toFixed(1)} T</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-wrap gap-3"
      >
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
        <Button variant="outline" className="flex-1">
          <Navigation className="mr-2 h-4 w-4" />
          Track Shipment
        </Button>
        <Button variant="outline" className="flex-1">
          <Phone className="mr-2 h-4 w-4" />
          Contact Driver
        </Button>
      </motion.div>
    </div>
  );
}
