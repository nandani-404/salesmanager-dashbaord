"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TruckerBid } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { User, Phone, Truck, Star, Package, Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface TruckerBidsSectionProps {
  bids: TruckerBid[];
  loadId: string;
}

export function TruckerBidsSection({ bids, loadId }: TruckerBidsSectionProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "rejected":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "counter-offered":
        return "bg-amber-50 border-amber-200 text-amber-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const handleViewProfile = (bid: TruckerBid) => {
    router.push(`/truckers/${bid.id}`);
  };

  if (bids.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Bids Yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Truckers haven't submitted any bids for this load yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Trucker Bids ({bids.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {bids.map((bid) => (
          <Card key={bid.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {bid.truckerName.split(" ").map(n => n[0]).join("")}
                  </div>
                  
                  {/* Trucker Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900">{bid.truckerName}</h4>
                    <p className="text-sm text-gray-600">{bid.truckerCompany}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-gray-700">{bid.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {bid.completedLoads} loads completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-lg border ${getStatusColor(bid.status)}`}>
                  <span className="text-xs font-semibold capitalize">{bid.status}</span>
                </div>
              </div>

              {/* Bid Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Bid Amount */}
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-1">Bid Amount</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(bid.bidAmount)}</p>
                </div>

                {/* Truck Type */}
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-1">Truck Type</p>
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {bid.truckType.replace("-", " ")}
                    </p>
                  </div>
                </div>

                {/* Truck Number */}
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-1">Truck Number</p>
                  <p className="text-sm font-semibold text-gray-900">{bid.truckNumber}</p>
                </div>

                {/* Driver */}
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-1">Driver</p>
                  <p className="text-sm font-semibold text-gray-900">{bid.driverName}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-medium text-gray-900">{formatDate(bid.pickupDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-600" />
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium text-gray-900">{formatDate(bid.deliveryDate)}</span>
                </div>
              </div>

              {/* Notes */}
              {bid.notes && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-gray-700">{bid.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(bid)}
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                {bid.status === "pending" && (
                  <>
                    <Button size="sm" className="flex-1">
                      Accept Bid
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Counter Offer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
