"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockLoads } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { MapPin, Phone, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function InTransitPage() {
  const inTransitLoads = mockLoads.filter((load) => load.status === "in-transit");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-700">In Transit Tracking</h1>
        <p className="mt-1 text-sm text-gray-600">
          Real-time tracking of active shipments
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          All Shipments
        </Button>
        <Button variant="outline" size="sm">
          <AlertCircle className="mr-2 h-4 w-4" />
          Critical
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Delayed
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Placeholder */}
        <Card className="lg:col-span-2">
          <div className="h-[600px] bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive Map View</p>
              <p className="text-sm text-gray-500 mt-2">
                Map integration would display real-time vehicle locations
              </p>
            </div>
          </div>
        </Card>

        {/* Shipment List */}
        <div className="space-y-4">
          {inTransitLoads.map((load, index) => (
            <motion.div
              key={load.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-700">{load.loadNumber}</p>
                      <p className="text-sm text-gray-600">{load.shipperName}</p>
                    </div>
                    <Badge variant="in-transit">In Transit</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Origin</p>
                        <p className="text-gray-600">
                          {load.origin.city}, {load.origin.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Destination</p>
                        <p className="text-gray-600">
                          {load.destination.city}, {load.destination.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Truck:</span>
                      <span className="font-medium text-gray-700">
                        {load.assignedTruck}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium text-gray-700">
                        {load.assignedDriver}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ETA:</span>
                      <span className="font-medium text-gray-700">
                        {formatDate(load.estimatedDeliveryDate)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="mr-2 h-3 w-3" />
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {inTransitLoads.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No shipments currently in transit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

