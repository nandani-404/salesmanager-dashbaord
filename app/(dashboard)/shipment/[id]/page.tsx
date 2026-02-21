"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockLoads } from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Truck,
  User,
  Phone,
  FileText,
  Clock,
  Weight,
  Box,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const load = mockLoads.find((l) => l.id === id);

  // Generate random bids count for the load
  const getBidsCount = (loadId: string) => {
    return Math.floor(Math.random() * 8) + 2; // Random between 2-10 bids
  };

  const bidsCount = load ? getBidsCount(load.id) : 0;

  if (!load) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Load Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The load you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/shipment")}>
            Back to Shipments
          </Button>
        </Card>
      </div>
    );
  }

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-center justify-between py-2">
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xs font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/shipment")}
            className="h-8 w-8 p-0 rounded-lg border-gray-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Load Details</h1>
            <p className="text-sm text-gray-500">TMLD-2024-{load.loadNumber}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
            load.status === "pending"
              ? "bg-amber-100 text-amber-700"
              : load.status === "confirmed"
              ? "bg-emerald-100 text-emerald-700"
              : load.status === "in-transit"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {load.status.charAt(0).toUpperCase() +
            load.status.slice(1).replace("-", " ")}
        </span>
      </motion.div>

      {/* Shipper Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Shipper Information
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">
                ₹{load.revenue.toLocaleString()}
              </p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-white mt-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">{bidsCount} Bids</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Shipper</p>
              <p className="font-semibold text-gray-900">{load.shipperName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">ID</p>
              <p className="font-semibold text-gray-900">{load.shipperId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Posted</p>
              <p className="font-semibold text-gray-900">
                {load.pickupDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
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
        <Card className="p-4 border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            Route Information
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded bg-blue-500 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs font-bold text-blue-700 uppercase">
                  Pickup
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-900">
                  {load.origin.city}, {load.origin.state}
                </p>
                <p className="text-gray-600 text-xs">{load.origin.address}</p>
                {load.pickupTime && (
                  <p className="text-gray-600 text-xs">
                    Time: {load.pickupTime}
                  </p>
                )}
                {load.contactPerson && (
                  <p className="text-gray-600 text-xs">
                    {load.contactPerson.pickup.name} •{" "}
                    {load.contactPerson.pickup.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 border border-green-200 rounded-lg bg-green-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded bg-green-500 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs font-bold text-green-700 uppercase">
                  Delivery
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-900">
                  {load.destination.city}, {load.destination.state}
                </p>
                <p className="text-gray-600 text-xs">
                  {load.destination.address}
                </p>
                {load.deliveryTime && (
                  <p className="text-gray-600 text-xs">
                    Time: {load.deliveryTime}
                  </p>
                )}
                {load.contactPerson && (
                  <p className="text-gray-600 text-xs">
                    {load.contactPerson.delivery.name} •{" "}
                    {load.contactPerson.delivery.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {load.distance && (
            <div className="mt-3 flex gap-3">
              <div className="flex-1 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-0.5">
                  Distance
                </p>
                <p className="text-base font-bold text-gray-900">
                  {load.distance} km
                </p>
              </div>
              {load.estimatedDuration && (
                <div className="flex-1 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase mb-0.5">
                    Duration
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {load.estimatedDuration}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Schedule & Cargo Combined */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-3">
          <Card className="p-4 border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Schedule
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 uppercase mb-1">
                  Pickup Date
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {load.pickupDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 uppercase mb-1">
                  Pickup Time
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {load.pickupTime || "10:00 AM"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" />
              Cargo Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase">Type</p>
                <p className="font-semibold text-gray-900">{load.cargo.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase">Weight</p>
                <p className="font-semibold text-gray-900">
                  {(load.cargo.weight / 1000).toFixed(1)}T
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase">Volume</p>
                <p className="font-semibold text-gray-900">
                  {load.cargo.volume} cu ft
                </p>
              </div>
              {load.cargo.quantity && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase">Quantity</p>
                  <p className="font-semibold text-gray-900">
                    {load.cargo.quantity}
                  </p>
                </div>
              )}
            </div>
            {load.cargo.specialRequirements &&
              load.cargo.specialRequirements.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {load.cargo.specialRequirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              )}
          </Card>
        </div>
      </motion.div>

      {/* Vehicle Requirements */}
      {load.vehicleRequirements && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-4 border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-600" />
              Vehicle Requirements
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase">Body Type</p>
                <p className="font-semibold text-gray-900">
                  {load.vehicleRequirements.bodyType.replace("-", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase">Size</p>
                <p className="font-semibold text-gray-900">
                  {load.vehicleRequirements.size}
                </p>
              </div>
              {load.vehicleRequirements.capacity && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase">Capacity</p>
                  <p className="font-semibold text-gray-900">
                    {load.vehicleRequirements.capacity}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => router.push(`/shipment/${load.id}/bids`)}
          className="bg-indigo-600 hover:bg-indigo-700 h-9 px-6"
        >
          <Users className="mr-2 h-4 w-4" />
          View Trucker Bids
        </Button>
      </div>
    </div>
  );
}
