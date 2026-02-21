"use client";

import { use, useState } from "react";
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
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import { mockVehicles } from "@/lib/mock-data";

const getVehicleData = (vehicleId: string) => {
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;

  return {
    ...vehicle,
    vehicleBody: vehicle.type === "refrigerated" ? "Closed Body" : vehicle.type === "dry-van" ? "Closed Body" : "Flat Bed",
    vehicleType: "32 ft",
    vehicleNumber: vehicle.truckNumber,
    ownerName: "Ramesh Transport Services Pvt Ltd",
    fatherName: "Late Suresh Kumar",
    permanentAddress: "Plot 45, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra - 400069",
    registrationDate: new Date("2022-03-15"),
    vehicleCategory: "Transport Vehicle",
    vehicleClass: "Heavy Goods Vehicle",
    rtoName: "Mumbai Central RTO (MH-02)",
    manufacturer: "Tata Motors",
    model: vehicle.type === "refrigerated" ? "LPT 2518 TC" : vehicle.type === "dry-van" ? "LPT 3118" : "LPT 2518",
    fuelType: "Diesel",
    engineNumber: `ENG${vehicleId}2024${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    chassisNumber: `CHS${vehicleId}2024${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    color: "White",
    seatingCapacity: 3,
    standingCapacity: 0,
    cubicCapacity: 5660,
    grossVehicleWeight: vehicle.capacity.weight,
    unladenWeight: Math.floor(vehicle.capacity.weight * 0.4),
    bodyType: vehicle.type === "refrigerated" ? "Refrigerated Container" : vehicle.type === "dry-van" ? "Dry Van" : "Flatbed",
    vehicleLocationState: "Maharashtra",
    vehicleLocationDistrict: "Mumbai",
    fitnessValidUpto: new Date("2025-03-15"),
    insuranceCompany: "ICICI Lombard General Insurance",
    insurancePolicyNumber: `POL${vehicleId}2024${Math.floor(Math.random() * 10000)}`,
    insuranceValidity: new Date("2025-06-30"),
    pollutionValidUpto: new Date("2025-02-28"),
    roadTaxPaidUpto: new Date("2025-12-31"),
    nationalPermitNumber: `NP${vehicleId}2024${Math.floor(Math.random() * 1000)}`,
    nationalPermitValidity: new Date("2025-12-31"),
    statePermitNumber: `SP${vehicleId}2024${Math.floor(Math.random() * 1000)}`,
    statePermitValidity: new Date("2025-12-31"),
    hypothecation: "None",
    nocDetails: "Clear - No Objection Certificate Issued",
    blacklistStatus: "Not Blacklisted",
    taxStatus: "Paid",
    rcStatus: "Active",
    smartCardIssued: "Yes",
    registrationValidUpto: new Date("2037-03-15"),
    previousRegistrationNumber: "N/A",
    makerModelDescription: vehicle.type === "refrigerated" 
      ? "TATA LPT 2518 TC - Refrigerated Container Body" 
      : vehicle.type === "dry-van"
      ? "TATA LPT 3118 - Dry Van Container Body"
      : "TATA LPT 2518 - Flatbed Cargo Body"
  };
};

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string; vehicleId: string }>;
}) {
  const { id: truckerId, vehicleId } = use(params);
  const router = useRouter();
  const vehicle = getVehicleData(vehicleId);
  const [activeTab, setActiveTab] = useState("overview");

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist.</p>
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
                <h2 className="text-3xl font-bold mb-1">{vehicle.truckNumber}</h2>
                <p className="text-blue-100 text-lg">{vehicle.licensePlate}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                    {vehicle.bodyType}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                    {vehicle.yearManufactured}
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
                  <InfoRow label="Manufacturer" value={vehicle.manufacturer} />
                  <InfoRow label="Model" value={vehicle.model} />
                  <InfoRow label="Fuel Type" value={vehicle.fuelType} />
                  <InfoRow label="Color" value={vehicle.color} />
                  <InfoRow label="Vehicle Body" value={vehicle.vehicleBody} />
                  <InfoRow label="Vehicle Type" value={vehicle.vehicleType} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Owner Information
                </h3>
                <div>
                  <InfoRow label="Owner Name" value={vehicle.ownerName} />
                  <InfoRow label="Father / Care Of" value={vehicle.fatherName} />
                  <div className="pt-3">
                    <p className="text-sm text-gray-600 mb-2">Permanent Address</p>
                    <p className="text-sm font-semibold text-gray-900">{vehicle.permanentAddress}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Location
                </h3>
                <div>
                  <InfoRow label="State" value={vehicle.vehicleLocationState} />
                  <InfoRow label="District" value={vehicle.vehicleLocationDistrict} />
                </div>
              </Card>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div>
                  <InfoRow label="Engine Number" value={vehicle.engineNumber} />
                  <InfoRow label="Chassis Number" value={vehicle.chassisNumber} />
                  <InfoRow label="Cubic Capacity (cc)" value={vehicle.cubicCapacity.toString()} />
                  <InfoRow label="Gross Vehicle Weight" value={`${vehicle.grossVehicleWeight.toLocaleString()} kg`} />
                  <InfoRow label="Unladen Weight" value={`${vehicle.unladenWeight.toLocaleString()} kg`} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Capacity Details</h3>
                <div>
                  <InfoRow label="Seating Capacity" value={vehicle.seatingCapacity.toString()} />
                  <InfoRow label="Standing Capacity" value={vehicle.standingCapacity.toString()} />
                  <InfoRow label="Body Type" value={vehicle.bodyType} />
                  <div className="pt-3">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-sm font-semibold text-gray-900">{vehicle.makerModelDescription}</p>
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
                  <InfoRow label="Registration Date" value={vehicle.registrationDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <InfoRow label="Vehicle Category" value={vehicle.vehicleCategory} />
                  <InfoRow label="Vehicle Class" value={vehicle.vehicleClass} />
                  <InfoRow label="RTO Name" value={vehicle.rtoName} />
                  <InfoRow label="Registration Valid Upto" value={vehicle.registrationValidUpto.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Insurance & Validity
                </h3>
                <div>
                  <InfoRow label="Insurance Company" value={vehicle.insuranceCompany} />
                  <InfoRow label="Policy Number" value={vehicle.insurancePolicyNumber} />
                  <InfoRow label="Insurance Validity" value={vehicle.insuranceValidity.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <InfoRow label="Fitness Valid Upto" value={vehicle.fitnessValidUpto.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <InfoRow label="PUC Valid Upto" value={vehicle.pollutionValidUpto.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <InfoRow label="Road Tax Paid Upto" value={vehicle.roadTaxPaidUpto.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Permit Information
                </h3>
                <div>
                  <InfoRow label="National Permit Number" value={vehicle.nationalPermitNumber} />
                  <InfoRow label="National Permit Validity" value={vehicle.nationalPermitValidity.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <InfoRow label="State Permit Number" value={vehicle.statePermitNumber} />
                  <InfoRow label="State Permit Validity" value={vehicle.statePermitValidity.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Additional Information
                </h3>
                <div>
                  <InfoRow label="Hypothecation" value={vehicle.hypothecation} />
                  <InfoRow label="NOC Details" value={vehicle.nocDetails} />
                  <InfoRow label="Smart Card Issued" value={vehicle.smartCardIssued} />
                  <InfoRow label="Previous Reg Number" value={vehicle.previousRegistrationNumber} />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">{vehicle.blacklistStatus}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">Tax {vehicle.taxStatus}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-medium">RC {vehicle.rcStatus}</p>
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
