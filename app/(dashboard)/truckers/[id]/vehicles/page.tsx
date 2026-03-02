"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api/client";
import EmptyState from "@/components/ui/EmptyState";

interface ApiVehicle {
  id: number;
  vehicle_id: string;
  registration_number: string;
  owner_name: string;
  vehicle_length?: string;
  manufacturer: string;
  model: string;
  registration_date: string;
  vehicle_body?: string;
  vehicle_type?: string;
  year_manufactured?: string;
  created_at?: string;
  updated_at?: string;
}

export default function TruckerVehiclesPage() {
  const params = useParams();
  const router = useRouter();
  const truckerId = params.id as string;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API state
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truckerUniqueId, setTruckerUniqueId] = useState<string>("");

  useEffect(() => {
    const fetchTruckerDetails = async () => {
      try {
        const response = await apiClient.get<any>(`/api/dashboard/trucker/${truckerId}`);
        const truckerData = response.data.trucker;
        setTruckerUniqueId(truckerData.unique_id || truckerId);
      } catch (err) {
        console.error("Failed to fetch trucker details:", err);
        setTruckerUniqueId(truckerId);
      }
    };

    if (truckerId) {
      fetchTruckerDetails();
    }
  }, [truckerId]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching vehicles for trucker ID:", truckerId);
        const response = await apiClient.get<any>(`/api/dashboard/truck-list/${truckerId}`);
        console.log("Full API Response:", response);
        console.log("Response data:", response.data);
        const apiData = response.data;

        // Handle the API response structure: data.data contains the vehicles array
        let vehiclesList = [];
        if (apiData.data && apiData.data.data) {
          console.log("Found data.data.data:", apiData.data.data);
          vehiclesList = apiData.data.data;
        } else if (apiData.data && Array.isArray(apiData.data)) {
          console.log("Found data.data as array:", apiData.data);
          vehiclesList = apiData.data;
        } else if (apiData.trucks) {
          console.log("Found data.trucks:", apiData.trucks);
          vehiclesList = apiData.trucks;
        } else if (Array.isArray(apiData)) {
          console.log("Data is array:", apiData);
          vehiclesList = apiData;
        } else {
          console.log("Unexpected data structure:", apiData);
          console.log("Data keys:", Object.keys(apiData));
        }

        console.log("Final vehicles list:", vehiclesList);
        console.log("Is array?", Array.isArray(vehiclesList));
        console.log("Length:", vehiclesList.length);

        const finalList = Array.isArray(vehiclesList) ? vehiclesList : [];
        setVehicles(finalList);
        console.log("Set vehicles state to:", finalList);
      } catch (err: any) {
        console.error("Failed to fetch vehicles:", err);
        console.error("Error response:", err?.response);
        console.error("Error data:", err?.response?.data);
        console.error("Error status:", err?.response?.status);
        setError(err?.response?.data?.message || err?.message || "Failed to load vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    if (truckerId) {
      fetchVehicles();
    }
  }, [truckerId]);

  // Calculate pagination
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = vehicles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVehicleType = (type?: string) => {
    if (!type) return "N/A";
    return type.replace("-", " ").replace(/_/g, " ");
  };

  const getYear = (vehicle: ApiVehicle) => {
    if (vehicle.year_manufactured) return vehicle.year_manufactured;
    if (vehicle.registration_date) {
      return new Date(vehicle.registration_date).getFullYear().toString();
    }
    if (vehicle.created_at) {
      return new Date(vehicle.created_at).getFullYear().toString();
    }
    return "N/A";
  };

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
            <p className="text-sm text-gray-600 mt-1">{truckerUniqueId || truckerId}</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <Truck className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Vehicles</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Retry
            </Button>
          </Card>
        )}

        {/* Vehicles List */}
        {!loading && !error && paginatedVehicles.length > 0 && (
          <div className="space-y-3">
            {paginatedVehicles.map((vehicle, index) => (
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
                          <h3 className="text-lg font-bold text-gray-800 mb-0.5">{vehicle.vehicle_id || `VEH-${vehicle.id}`}</h3>
                          <p className="text-xs text-gray-600 mb-1.5">{vehicle.registration_number}</p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-14 w-px bg-gray-200"></div>

                      {/* Middle: Vehicle Stats */}
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                          <p className="text-sm font-bold text-gray-800">
                            {vehicle.owner_name || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Manufacturer</p>
                          <p className="text-sm font-bold text-gray-800">
                            {vehicle.manufacturer || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Model</p>
                          <p className="text-sm font-bold text-gray-800">
                            {vehicle.model || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vehicle Type</p>
                          <p className="text-sm font-bold text-gray-800 capitalize">
                            {getVehicleType(vehicle.vehicle_type)}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year</p>
                          <p className="text-lg font-bold text-gray-800">
                            {getYear(vehicle)}
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
        )}

        {/* No Vehicles */}
        {!loading && !error && vehicles.length === 0 && (
          <EmptyState
            title="No Vehicles Found"
            message="This trucker hasn't added any vehicles yet"
          />
        )}

        {/* Pagination */}
        {!loading && !error && vehicles.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mt-6"
          >
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-800">{Math.min(endIndex, vehicles.length)}</span> of{" "}
              <span className="font-semibold text-gray-800">{vehicles.length}</span> vehicles
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 px-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  const showEllipsis =
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`h-9 w-9 p-0 rounded-lg ${currentPage === page
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 px-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
