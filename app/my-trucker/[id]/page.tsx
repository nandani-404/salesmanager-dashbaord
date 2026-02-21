"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockTruckerBids } from "@/lib/mock-trucker-bids";
import { ArrowLeft, Phone, Mail, Star, Truck, Package } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function TruckerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Find trucker by index (id is now numeric)
  const truckerIndex = parseInt(id) - 1;
  const bid = mockTruckerBids[truckerIndex];

  if (!bid) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Trucker not found</h2>
        <Link href="/my-trucker">
          <Button className="mt-4">Back to List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="h-24 w-24 rounded-xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {bid.truckerCompany
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {bid.truckerName}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{bid.truckerCompany}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{bid.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {bid.completedLoads} loads completed
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{bid.driverPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">
                  contact@{bid.truckerCompany.toLowerCase().replace(/\s+/g, "")}
                  .com
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">
              Business Details
            </h3>
            <div className="space-y-3">
              {bid.gstNumber && (
                <div>
                  <p className="text-sm text-gray-600">GST Number</p>
                  <p className="font-medium text-gray-900">{bid.gstNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Bid Number</p>
                <p className="font-medium text-gray-900">{bid.bidNumber}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Vehicle Information
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Truck Number</p>
              <p className="font-semibold text-gray-900">{bid.truckNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Truck Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {bid.truckType.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver</p>
              <p className="font-semibold text-gray-900">{bid.driverName}</p>
            </div>
          </div>
          <Link href={`/truckers/${id}/vehicles`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Truck className="mr-2 h-4 w-4" />
              View All Trucks
            </Button>
          </Link>
        </Card>

        {bid.notes && (
          <Card className="p-6 bg-gray-50 mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700">{bid.notes}</p>
          </Card>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Load {bid.loadNumber}</p>
              <p className="text-sm text-gray-600">
                Bid Amount: ₹{bid.bidAmount.toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                bid.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : bid.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : bid.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
