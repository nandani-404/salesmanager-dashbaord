"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Edit, Camera, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api/client";
import { BASE_URL } from "@/config/page";
import Image from "next/image";

interface EmployeeData {
  id: number;
  emp_id: string;
  full_name: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  doj: string;
  work_location: string;
  current_address: string;
  city: string;
  state: string;
  pin: string;
  photo_path?: string;
}

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get("/api/dashboard/employees/15");
        
        console.log("API Response:", response.data);
        
        if (response.data && response.data.status && response.data.data) {
          setEmployeeData(response.data.data);
        } else {
          setError("No data received from API");
        }
      } catch (err: any) {
        console.error("Error fetching employee data:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch employee data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col space-y-1 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log("Image selected:", file);
      alert("Image upload functionality will be implemented");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !employeeData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Failed to load profile"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div 
            className="h-32 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%),
                linear-gradient(135deg, #667eea 0%, #764ba2 100%)
              `
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative">
                  {employeeData?.photo_path ? (
                    <div className="-mt-16 h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      <Image
                        src={`${BASE_URL}/${employeeData.photo_path}`}
                        alt={employeeData.full_name || "Profile"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">${getInitials(employeeData?.full_name || "")}</div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="-mt-16 h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {getInitials(employeeData?.full_name || "")}
                    </div>
                  )}
                  {isEditMode && (
                    <label 
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                    >
                      <Camera className="h-5 w-5 text-white" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{employeeData?.full_name || "N/A"}</h1>
                  <p className="text-gray-600 font-medium">{employeeData?.designation || "N/A"}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {employeeData?.department || "N/A"} Department
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {employeeData?.city || "N/A"}, {employeeData?.state || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                className="mt-4 sm:mt-0"
                onClick={() => setIsEditMode(!isEditMode)}
                variant={isEditMode ? "outline" : "primary"}
              >
                {isEditMode ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-blue-800 font-medium">
                  Click the camera icon on your profile picture to upload a new image
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-x-8">
              <InfoRow label="Full Name" value={employeeData?.full_name || "N/A"} />
              <InfoRow label="Email" value={employeeData?.email || "N/A"} />
              <InfoRow label="Mobile" value={employeeData?.mobile || "N/A"} />
              <InfoRow label="Employee ID" value={employeeData?.emp_id || "N/A"} />
              <InfoRow label="Department" value={employeeData?.department || "N/A"} />
              <InfoRow label="Designation" value={employeeData?.designation || "N/A"} />
              <InfoRow label="Date of Joining" value={formatDate(employeeData?.doj || "")} />
              <InfoRow label="Work Location" value={employeeData?.work_location || "N/A"} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-x-8">
              <div className="md:col-span-2">
                <InfoRow 
                  label="Current Address" 
                  value={employeeData?.current_address || "N/A"} 
                />
              </div>
              <InfoRow label="City" value={employeeData?.city || "N/A"} />
              <InfoRow label="State" value={employeeData?.state || "N/A"} />
              <InfoRow label="PIN Code" value={employeeData?.pin || "N/A"} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

