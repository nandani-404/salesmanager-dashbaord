"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Edit, Camera, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);

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
                  <div className="-mt-16 h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    NS
                  </div>
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
                  <h1 className="text-2xl font-bold text-gray-900">Nandani Saraswat</h1>
                  <p className="text-gray-600 font-medium">Application Developer</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      IT Department
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Noida, Uttar Pradesh
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
              <InfoRow label="Full Name" value="Nandani Saraswat" />
              <InfoRow label="Email" value="nandani.truckmitr@gmail.com" />
              <InfoRow label="Mobile" value="6265760864" />
              <InfoRow label="Employee ID" value="TM2511DLEM00005" />
              <InfoRow label="Department" value="IT" />
              <InfoRow label="Designation" value="Application Developer" />
              <InfoRow label="Date of Joining" value="11/6/2025" />
              <InfoRow label="Work Location" value="C104, sector 65, noida, uttar pradesh" />
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
                  value="Niksam girls pg , gayatri bhawan, ch-24, gali no. 1, chhijarsi, chhajarsi colony, sector 63, noida, uttar pradesh" 
                />
              </div>
              <InfoRow label="City" value="Noida" />
              <InfoRow label="State" value="Delhi" />
              <InfoRow label="PIN Code" value="201309" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

