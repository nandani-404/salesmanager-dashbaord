"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Truck, 
  User,
  Shield,
  CheckCircle,
  Wrench,
  MapPin,
  FileText,
  Info,
  Download,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";

interface VehicleDetail {
  id: number;
  user_id: string;
  vehicle_id: string;
  vehicle_body: string;
  vehicle_type: string;
  registration_number: string;
  owner_name: string;
  father_name: string;
  permanent_address: string;
  registration_date: string;
  vehicle_category: string;
  vehicle_class: string;
  manufacturer: string;
  model: string;
  fuel_type: string;
  engine_number: string;
  chassis_number: string;
  color: string;
  seating_capacity: string;
  standing_capacity: string;
  cubic_capacity: string;
  gross_vehicle_weight: string;
  unladen_weight: string;
  fitness_valid_upto: string;
  insurance_company: string;
  insurance_policy_number: string;
  insurance_validity: string;
  pollution_valid_upto: string;
  road_tax_paid_upto: string;
  national_permit_number: string;
  national_permit_validity: string;
  state_permit_number: string;
  state_permit_validity: string;
  hypothecation: string;
  noc_details: string;
  blacklist_status: string;
  tax_status: string;
  rc_status: string;
  smart_card_issued: string;
  registration_valid_upto: string;
  previous_registration_number: string;
  rto_name: string;
  vehicle_location_state: string;
  vehicle_location_district: string;
  maker_model_description: string;
}

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string; vehicleId: string }>;
}) {
  const { id: truckerId, vehicleId } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching vehicle detail for ID:", vehicleId);
        const response = await apiClient.get<any>(`/api/dashboard/vehicle/${vehicleId}`);
        console.log("Vehicle detail response:", response.data);
        
        // Handle response structure
        const vehicleData = response.data.vehicle || response.data.data || response.data;
        setVehicle(vehicleData);
      } catch (err: any) {
        console.error("Failed to fetch vehicle details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetail();
    }
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Vehicle" : "Vehicle Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The vehicle you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push(`/truckers/${truckerId}/vehicles`)} className="w-full">
            Back to Vehicles
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "specifications", label: "Specifications", icon: Wrench },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleDownloadPDF = () => {
    // PDF download functionality will be implemented here
    alert("PDF download functionality will be implemented");
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/truckers/${truckerId}/vehicles`)}
              className="h-10 w-10 p-0 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
              <p className="text-sm text-gray-500">Complete vehicle information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{vehicle.vehicle_id}</h2>
                <p className="text-blue-100 text-lg">{vehicle.registration_number}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                    {vehicle.vehicle_body || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                    {vehicle.registration_date ? new Date(vehicle.registration_date).getFullYear() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Card className="p-1 bg-gray-100">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Vehicle Information
                </h3>
                <div>
                  <InfoRow label="Manufacturer" value={vehicle.manufacturer || "N/A"} />
                  <InfoRow label="Model" value={vehicle.model || "N/A"} />
                  <InfoRow label="Fuel Type" value={vehicle.fuel_type || "N/A"} />
                  <InfoRow label="Color" value={vehicle.color || "N/A"} />
                  <InfoRow label="Vehicle Body" value={vehicle.vehicle_body || "N/A"} />
                  <InfoRow label="Vehicle Type" value={vehicle.vehicle_type || "N/A"} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Owner Information
                </h3>
                <div>
                  <InfoRow label="Owner Name" value={vehicle.owner_name || "N/A"} />
                  <InfoRow label="Father / Care Of" value={vehicle.father_name || "N/A"} />
                  <div className="pt-3">
                    <p className="text-sm text-gray-600 mb-2">Permanent Address</p>
                    <p className="text-sm font-semibold text-gray-900">{vehicle.permanent_address || "N/A"}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Location
                </h3>
                <div>
                  <InfoRow label="State" value={vehicle.vehicle_location_state || "N/A"} />
                  <InfoRow label="District" value={vehicle.vehicle_location_district || "N/A"} />
                </div>
              </Card>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div>
                  <InfoRow label="Engine Number" value={vehicle.engine_number || "N/A"} />
                  <InfoRow label="Chassis Number" value={vehicle.chassis_number || "N/A"} />
                  <InfoRow label="Cubic Capacity (cc)" value={vehicle.cubic_capacity || "N/A"} />
                  <InfoRow label="Gross Vehicle Weight" value={vehicle.gross_vehicle_weight ? `${vehicle.gross_vehicle_weight} kg` : "N/A"} />
                  <InfoRow label="Unladen Weight" value={vehicle.unladen_weight ? `${vehicle.unladen_weight} kg` : "N/A"} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Capacity Details</h3>
                <div>
                  <InfoRow label="Seating Capacity" value={vehicle.seating_capacity || "N/A"} />
                  <InfoRow label="Standing Capacity" value={vehicle.standing_capacity || "N/A"} />
                  <InfoRow label="Body Type" value={vehicle.vehicle_body || "N/A"} />
                  <div className="pt-3">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-sm font-semibold text-gray-900">{vehicle.maker_model_description || "N/A"}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Registration Details
                </h3>
                <div>
                  <InfoRow label="Registration Date" value={vehicle.registration_date ? new Date(vehicle.registration_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                  <InfoRow label="Vehicle Category" value={vehicle.vehicle_category || "N/A"} />
                  <InfoRow label="Vehicle Class" value={vehicle.vehicle_class || "N/A"} />
                  <InfoRow label="RTO Name" value={vehicle.rto_name || "N/A"} />
                  <InfoRow label="Registration Valid Upto" value={vehicle.registration_valid_upto ? new Date(vehicle.registration_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Insurance & Validity
                </h3>
                <div>
                  <InfoRow label="Insurance Company" value={vehicle.insurance_company || "N/A"} />
                  <InfoRow label="Policy Number" value={vehicle.insurance_policy_number || "N/A"} />
                  <InfoRow label="Insurance Validity" value={vehicle.insurance_validity ? new Date(vehicle.insurance_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                  <InfoRow label="Fitness Valid Upto" value={vehicle.fitness_valid_upto ? new Date(vehicle.fitness_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                  <InfoRow label="PUC Valid Upto" value={vehicle.pollution_valid_upto ? new Date(vehicle.pollution_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                  <InfoRow label="Road Tax Paid Upto" value={vehicle.road_tax_paid_upto ? new Date(vehicle.road_tax_paid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Permit Information
                </h3>
                <div>
                  <InfoRow label="National Permit Number" value={vehicle.national_permit_number || "N/A"} />
                  <InfoRow label="National Permit Validity" value={vehicle.national_permit_validity ? new Date(vehicle.national_permit_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                  <InfoRow label="State Permit Number" value={vehicle.state_permit_number || "N/A"} />
                  <InfoRow label="State Permit Validity" value={vehicle.state_permit_validity ? new Date(vehicle.state_permit_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Additional Information
                </h3>
                <div>
                  <InfoRow label="Hypothecation" value={vehicle.hypothecation || "N/A"} />
                  <InfoRow label="NOC Details" value={vehicle.noc_details || "N/A"} />
                  <InfoRow label="Smart Card Issued" value={vehicle.smart_card_issued || "N/A"} />
                  <InfoRow label="Previous Reg Number" value={vehicle.previous_registration_number || "N/A"} />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">{vehicle.blacklist_status || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">Tax {vehicle.tax_status || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">RC {vehicle.rc_status || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}


        </motion.div>
      </div>
    </div>
  );
}
