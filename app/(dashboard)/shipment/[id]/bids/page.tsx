"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockLoads } from "@/lib/mock-data";
import { mockTruckerBids } from "@/lib/mock-trucker-bids";
import {
  ArrowLeft,
  User,
  Truck,
  Star,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ShipmentBidsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [counterDialogOpen, setCounterDialogOpen] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterOffers, setCounterOffers] = useState<Record<string, number>>({});
  const [acceptDialogOpen, setAcceptDialogOpen] = useState<string | null>(null);
  const [finalShipperPrice, setFinalShipperPrice] = useState("");
  const [finalTruckerPrice, setFinalTruckerPrice] = useState("");
  const [finalStatus, setFinalStatus] = useState<"match" | "unmatch">("match");

  // Use first mock load as fallback if ID doesn't match
  const load = mockLoads.find((l) => l.id === id) || mockLoads[0];
  const bids = mockTruckerBids.filter((bid) => bid.loadId === (load?.id || id));

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/shipment/${id}`)}
            className="h-9 w-9 p-0 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trucker Bids</h1>
            <p className="text-sm text-gray-600 mt-1">
              Shipper: {load.shipperName || "N/A"} • {bids.length} bid{bids.length !== 1 ? "s" : ""} received
            </p>
          </div>
        </div>

        {/* Load Summary */}
        <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Route</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {load.origin.city} → {load.destination.city}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Cargo</p>
                <p className="font-semibold text-gray-900 text-sm">{load.cargo.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Weight</p>
                <p className="font-semibold text-gray-900 text-sm">{(load.cargo.weight / 1000).toFixed(1)} T</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 rounded-full p-0"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase mb-0.5">Price</p>
                <p className="font-bold text-indigo-600 text-xl">₹{load.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bids List */}
      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${
                index === 0 
                  ? 'bg-gradient-to-br from-yellow-50/80 via-orange-50/60 to-amber-50/70 border-orange-500' 
                  : 'bg-white border-gray-200'
              }`}>
                {/* Best Bid Ribbon */}
                {index === 0 && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="relative w-20 h-20 overflow-hidden">
                      <div className="absolute top-1.5 -right-7 w-24 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-0.5 rotate-45 shadow-md">
                        <span className="text-[8px] font-bold tracking-wide">BEST BID</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                        {bid.truckerCompany
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{bid.truckerName}</h3>
                        <p className="text-sm text-gray-600">{bid.truckerCompany}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase mb-0.5">Bid Price</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹{(counterOffers[bid.id] || bid.bidAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase mb-1">Truck Number</p>
                      <p className="font-semibold text-gray-900">{bid.truckNumber}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase mb-1">RC Number</p>
                      <p className="font-semibold text-gray-900">{bid.truckNumber.replace("MH", "RC")}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-300 hover:bg-blue-50 hover:text-blue-700 h-9"
                      onClick={() => router.push(`/truckers/${bid.id}`)}
                    >
                      <User className="mr-1.5 h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-purple-300 hover:bg-purple-50 hover:text-purple-700 h-9"
                      onClick={() => router.push(`/truckers/${bid.id}/vehicles`)}
                    >
                      <Truck className="mr-1.5 h-4 w-4" />
                      View Truck
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9"
                    >
                      <Phone className="mr-1.5 h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-9"
                      onClick={() => {
                        setAcceptDialogOpen(bid.id);
                        setFinalShipperPrice(load.revenue.toString());
                        setFinalTruckerPrice((counterOffers[bid.id] || bid.bidAmount).toString());
                      }}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Accept
                    </Button>
                  </div>

                  {/* Accept Dialog */}
                  {acceptDialogOpen === bid.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-white rounded-xl border-2 border-green-200 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-bold text-green-900 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Accept Bid
                        </h4>
                        <button
                          onClick={() => {
                            setAcceptDialogOpen(null);
                            setFinalShipperPrice("");
                            setFinalTruckerPrice("");
                            setFinalStatus("match");
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Summary Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500 uppercase font-semibold">Shipper</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{load.shipperName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 mb-2">
                            <p className="text-[10px] text-gray-500 mb-0.5">Original Price</p>
                            <p className="text-lg font-bold text-blue-600">₹{load.revenue.toLocaleString()}</p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8"
                          >
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                            Call Shipper
                          </Button>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-indigo-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Truck className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500 uppercase font-semibold">Trucker</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{bid.truckerName}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 mb-2">
                            <p className="text-[10px] text-gray-500 mb-0.5">Bid Price</p>
                            <p className="text-lg font-bold text-indigo-600">₹{(counterOffers[bid.id] || bid.bidAmount).toLocaleString()}</p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-8"
                          >
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                            Call Trucker
                          </Button>
                        </div>
                      </div>

                      {/* Final Prices */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 mb-1 block uppercase">Final Shipper</label>
                          <input
                            type="number"
                            value={finalShipperPrice}
                            onChange={(e) => setFinalShipperPrice(e.target.value)}
                            placeholder="₹"
                            className="w-full h-9 px-2 text-sm font-semibold border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 mb-1 block uppercase">Final Trucker</label>
                          <input
                            type="number"
                            value={finalTruckerPrice}
                            onChange={(e) => setFinalTruckerPrice(e.target.value)}
                            placeholder="₹"
                            className="w-full h-9 px-2 text-sm font-semibold border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 mb-1 block uppercase">Status</label>
                          <select
                            value={finalStatus}
                            onChange={(e) => setFinalStatus(e.target.value as "match" | "unmatch")}
                            className="w-full h-9 px-2 text-sm font-semibold border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          >
                            <option value="match">✓ Match</option>
                            <option value="unmatch">✗ Unmatch</option>
                          </select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            alert(`Bid accepted!\nShipper Price: ₹${finalShipperPrice}\nTrucker Price: ₹${finalTruckerPrice}\nStatus: ${finalStatus}`);
                            setAcceptDialogOpen(null);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-9 font-bold shadow-md"
                        >
                          <CheckCircle className="mr-1.5 h-4 w-4" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAcceptDialogOpen(null);
                            setFinalShipperPrice("");
                            setFinalTruckerPrice("");
                            setFinalStatus("match");
                          }}
                          className="border-2 border-gray-300 hover:bg-gray-100 h-9 px-6 font-semibold"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Card className="p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bids Yet</h3>
            <p className="text-gray-500">No truckers have submitted bids for this load yet.</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
