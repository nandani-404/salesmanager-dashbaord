"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { mockVehicles } from "@/lib/mock-data";

export default function TruckerVehiclesPage() {
  const params = useParams();
  const router = useRouter();
  const truckerId = params.id as string;

  // Get vehicles for this trucker (using mock data)
  const vehicles = mockVehicles.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-6 py-6 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/truckers')}
            className="h-9 w-9 p-0 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-700">Vehicles</h1>
            <p className="text-sm text-gray-600 mt-1">Trucker ID: {truckerId}</p>
          </div>
        </motion.div>

        {/* Vehicles List */}
        <div className="space-y-3">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-6">
                    {/* Left: Icon & Vehicle Info */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Truck className="h-8 w-8 text-white" />
                      </div>
                      <div className="min-w-[160px]">
                        <h3 className="text-lg font-bold text-gray-800 mb-0.5">{vehicle.truckNumber}</h3>
                        <p className="text-xs text-gray-600 mb-1.5">{vehicle.licensePlate}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-14 w-px bg-gray-200"></div>

                    {/* Middle: Vehicle Stats */}
                    <div className="flex items-center gap-6 flex-1">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                        <p className="text-sm font-bold text-gray-800">
                          Ramesh Transport
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Manufacturer</p>
                        <p className="text-sm font-bold text-gray-800">
                          Tata Motors
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Model</p>
                        <p className="text-sm font-bold text-gray-800">
                          {vehicle.type === "refrigerated" ? "LPT 2518 TC" : vehicle.type === "dry-van" ? "LPT 3118" : "LPT 2518"}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vehicle Type</p>
                        <p className="text-sm font-bold text-gray-800 capitalize">
                          {vehicle.type.replace("-", " ")}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year</p>
                        <p className="text-lg font-bold text-gray-800">
                          {vehicle.yearManufactured}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-14 w-px bg-gray-200"></div>

                    {/* Right: Action Buttons */}
                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
                        onClick={() => router.push(`/truckers/${truckerId}/vehicles/${vehicle.id}`)}
                      >
                        <span className="text-sm font-medium">View Full Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Vehicles */}
        {vehicles.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Vehicles Found
              </h3>
              <p className="text-sm text-gray-600">
                This trucker hasn't added any vehicles yet.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
