"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockLoads } from "@/lib/mock-data";
import { mockTruckerBids } from "@/lib/mock-trucker-bids";
import { formatCurrency, formatDate } from "@/lib/utils";
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
  Layers,
  Hash,
  Ruler,
} from "lucide-react";
import { motion } from "framer-motion";
import { TruckerBidsSection } from "@/components/dashboard/trucker-bids-section";

export default function LoadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loadId = params.id as string;

  const load = mockLoads.find((l) => l.id === loadId);
  const truckerBids = mockTruckerBids.filter((bid) => bid.loadId === loadId);

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
      {/* Header */}
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
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{load.loadNumber}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{load.shipperName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(load.revenue)}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">Active</span>
          </div>
        </div>
      </motion.div>

      {/* Route Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pickup */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pickup</p>
                    <p className="font-semibold text-gray-900">{load.origin.city}, {load.origin.state}</p>
                  </div>
                </div>
                <div className="pl-13 space-y-2">
                  <p className="text-sm text-gray-600">{load.origin.address}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(load.pickupDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{load.pickupTime || "TBD"}</span>
                    </div>
                  </div>
                  {load.contactPerson?.pickup && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{load.contactPerson.pickup.name} • {load.contactPerson.pickup.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Drop */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Drop</p>
                    <p className="font-semibold text-gray-900">{load.destination.city}, {load.destination.state}</p>
                  </div>
                </div>
                <div className="pl-13 space-y-2">
                  <p className="text-sm text-gray-600">{load.destination.address}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(load.deliveryDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{load.deliveryTime || "TBD"}</span>
                    </div>
                  </div>
                  {load.contactPerson?.delivery && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{load.contactPerson.delivery.name} • {load.contactPerson.delivery.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Distance & Duration */}
            {(load.distance || load.estimatedDuration) && (
              <div className="mt-6 pt-6 border-t flex items-center gap-6 text-sm">
                {load.distance && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{load.distance} km</span>
                  </div>
                )}
                {load.estimatedDuration && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{load.estimatedDuration}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Vehicle Requirements */}
      {load.vehicleRequirements && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vehicle Requirements</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Vehicle Body Type */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Body Type</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{load.vehicleRequirements.bodyType.replace("-", " ")}</p>
                </div>

                {/* Vehicle Size */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-5 w-5 text-fuchsia-600" />
                    <p className="text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Vehicle Size</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{load.vehicleRequirements.size}</p>
                </div>

                {/* Capacity */}
                {load.vehicleRequirements.capacity && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="h-5 w-5 text-amber-600" />
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Capacity</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{load.vehicleRequirements.capacity}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Cargo Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Cargo Details</h3>
            
            {/* Material Category */}
            <div className="mb-6 p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-4 w-4 text-indigo-600" />
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Material Category</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{load.cargo.category}</p>
              <p className="text-sm text-gray-600 mt-0.5">{load.cargo.type}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Weight */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Weight className="h-4 w-4 text-gray-600" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{(load.cargo.weight / 2204.62).toFixed(1)} T</p>
                <p className="text-xs text-gray-500 mt-0.5">{load.cargo.weight.toLocaleString()} lbs</p>
              </div>

              {/* Volume */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="h-4 w-4 text-gray-600" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Volume</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{load.cargo.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">cu ft</p>
              </div>

              {load.cargo.quantity && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{load.cargo.quantity}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Units</p>
                </div>
              )}

              {load.cargo.packagingType && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Packaging</p>
                  </div>
                  <p className="text-base font-bold text-gray-900 leading-tight">{load.cargo.packagingType}</p>
                </div>
              )}
            </div>

            {/* Special Requirements */}
            {load.cargo.specialRequirements && load.cargo.specialRequirements.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-semibold text-gray-900">Special Requirements</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {load.cargo.specialRequirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-md bg-white border border-amber-300 text-amber-800 text-sm font-medium"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Additional Information */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Shipper */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Shipper Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company Name</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{load.shipperName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shipper ID</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{load.shipperId}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment Terms */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Payment Terms</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Terms</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">Net 30 Days</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">Standard</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Instructions */}
      {(load.instructions?.pickup || load.instructions?.delivery || load.instructions?.handling) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Special Instructions</h3>
              </div>
              <div className="space-y-3">
                {load.instructions?.pickup && (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">Pickup Instructions</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{load.instructions.pickup}</p>
                  </div>
                )}
                {load.instructions?.delivery && (
                  <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
                    <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-1.5">Delivery Instructions</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{load.instructions.delivery}</p>
                  </div>
                )}
                {load.instructions?.handling && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Handling Instructions</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{load.instructions.handling}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Trucker Bids Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TruckerBidsSection bids={truckerBids} loadId={loadId} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-wrap gap-3"
      >
        <Button className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
        <Button variant="outline" className="flex-1">
          <Navigation className="mr-2 h-4 w-4" />
          Track Shipment
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          View Documents
        </Button>
      </motion.div>
    </div>
  );
}
