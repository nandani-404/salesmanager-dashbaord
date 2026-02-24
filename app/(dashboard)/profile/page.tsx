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
  department_id: string;
  department_name: string;
  designation: string;
  doj: string;
  work_location: string;
  current_address: string;
  city: string;
  state_id: string;
  state_name: string;
  pin: string;
  photo_path?: string;
  photo_url?: string;
}

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<Partial<EmployeeData>>({});

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

  const renderInfoRow = (label: string, value: string, field?: keyof EmployeeData) => {
    const currentValue = field && isEditMode && editedData[field] !== undefined 
      ? String(editedData[field]) 
      : value;
    
    return (
      <div key={field || label} className="flex flex-col space-y-1 py-3 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
        {isEditMode && field ? (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditedData(prev => ({ ...prev, [field]: newValue }));
            }}
            className="text-sm font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className="text-sm font-semibold text-gray-900">{value}</span>
        )}
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log("Image selected:", file);
      alert("Image upload functionality will be implemented");
    }
  };

  const handleSaveProfile = async () => {
    if (!employeeData) return;

    try {
      setSaving(true);
      setError(null);

      // Merge edited data with existing data
      const updatedData = {
        full_name: editedData.full_name || employeeData.full_name,
        mobile: editedData.mobile || employeeData.mobile,
        email: editedData.email || employeeData.email,
        department_id: editedData.department_id || employeeData.department_id,
        designation: editedData.designation || employeeData.designation,
        doj: editedData.doj || employeeData.doj,
        work_location: editedData.work_location || employeeData.work_location,
        current_address: editedData.current_address || employeeData.current_address,
        city: editedData.city || employeeData.city,
        state_id: editedData.state_id || employeeData.state_id,
        pin: editedData.pin || employeeData.pin,
      };

      const response = await apiClient.post(`/api/dashboard/employees/${employeeData.id}/update`, updatedData);

      if (response.data && response.data.status) {
        // Update local state with new data
        setEmployeeData({ ...employeeData, ...updatedData });
        setEditedData({});
        setIsEditMode(false);
        alert("Profile updated successfully!");
      } else {
        setError("Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({});
    setIsEditMode(false);
  };

  const handleEnterEditMode = () => {
    // Initialize editedData with current values when entering edit mode
    if (employeeData) {
      setEditedData({
        full_name: employeeData.full_name,
        mobile: employeeData.mobile,
        email: employeeData.email,
        department_id: employeeData.department_id,
        designation: employeeData.designation,
        doj: employeeData.doj,
        work_location: employeeData.work_location,
        current_address: employeeData.current_address,
        city: employeeData.city,
        state_id: employeeData.state_id,
        pin: employeeData.pin,
      });
    }
    setIsEditMode(true);
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
                        src={`${BASE_URL}/storage/app/public/${employeeData.photo_path}`}
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
                      {employeeData?.department_name || "N/A"} Department
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {employeeData?.city || "N/A"}, {employeeData?.state_name || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      disabled={saving}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleEnterEditMode}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
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
              {renderInfoRow("Full Name", employeeData?.full_name || "N/A", "full_name")}
              {renderInfoRow("Email", employeeData?.email || "N/A", "email")}
              {renderInfoRow("Mobile", employeeData?.mobile || "N/A", "mobile")}
              {renderInfoRow("Employee ID", employeeData?.emp_id || "N/A")}
              {renderInfoRow("Department", employeeData?.department_name || "N/A", "department_id")}
              {renderInfoRow("Designation", employeeData?.designation || "N/A", "designation")}
              {renderInfoRow("Date of Joining", formatDate(employeeData?.doj || ""), "doj")}
              {renderInfoRow("Work Location", employeeData?.work_location || "N/A", "work_location")}
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
                {renderInfoRow("Current Address", employeeData?.current_address || "N/A", "current_address")}
              </div>
              {renderInfoRow("City", employeeData?.city || "N/A", "city")}
              {renderInfoRow("State", employeeData?.state_name || "N/A", "state_id")}
              {renderInfoRow("PIN Code", employeeData?.pin || "N/A", "pin")}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

