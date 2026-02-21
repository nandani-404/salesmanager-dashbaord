"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockTruckerBids } from "@/lib/mock-trucker-bids";
import { Eye, Truck } from "lucide-react";
import Link from "next/link";

export default function MyTruckerPage() {
  // Get unique truckers from bids
  const truckers = Array.from(
    new Map(
      mockTruckerBids.map((bid, index) => [
        bid.truckerCompany,
        {
          id: String(index + 1), // Use simple numeric ID that matches the vehicles route
          bidId: bid.id, // Keep original bid ID for reference
          company: bid.truckerCompany,
          name: bid.truckerName,
          truckerId: `TMTK${String(index + 1).padStart(5, "0")}`,
          totalVehicles: Math.floor(Math.random() * 15) + 5,
          completedLoads: bid.completedLoads,
          rating: bid.rating,
        },
      ])
    ).values()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Truckers</h1>
        <p className="text-gray-600 mt-2">View and manage trucker profiles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(truckers).map((trucker) => (
          <Card key={trucker.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                {trucker.company
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {trucker.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{trucker.company}</p>
                <p className="text-xs text-gray-500 mt-1">{trucker.truckerId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {trucker.completedLoads}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Vehicles</p>
                <p className="text-xl font-bold text-gray-900">
                  {trucker.totalVehicles}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/my-trucker/${trucker.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </Link>
              <Link href={`/truckers/${trucker.id}/vehicles`}>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Truck className="mr-2 h-4 w-4" />
                  View Trucks
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
