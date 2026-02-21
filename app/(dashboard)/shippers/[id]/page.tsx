"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Package,
    Star,
    FileText,
    Eye,
    MapPin,
    Check,
    X,
    Loader2,
    ShieldCheck,
    Building2,
    Calendar,
    CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "@/config/page";
import apiClient from "@/lib/api/client";

// Full shipper details interface from the shippers-full API
interface ShipperFullDetails {
    id: number;
    name: string;
    email: string | null;
    mobile: string;
    unique_id: string;
    profile_image: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    kyc_verified: string;
    status: string;
    load_count: string;
    total_ratings: string;
    average_rating: number;
    gst_number: string | null;
    pan_number: string | null;
    company_name: string | null;
    company_type: string | null;
    bank_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    branch_name: string | null;
    created_at: string | null;
    [key: string]: any; // Allow additional fields from the API
}

export default function ShipperDetailPage() {
    const params = useParams();
    const router = useRouter();
    const shipperId = params.id as string;

    const [shipper, setShipper] = useState<ShipperFullDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

    useEffect(() => {
        const fetchShipperDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get<any>(
                    `${API_ENDPOINTS.dashboard.shippersFull}?shipper_id=${shipperId}`
                );
                const data = response.data;

                // The API may return the shipper data directly or inside a wrapper
                if (data.shipper) {
                    setShipper(data.shipper);
                } else if (data.id) {
                    setShipper(data);
                } else {
                    setError("Shipper details not found");
                }
            } catch (err: any) {
                console.error("Failed to fetch shipper details:", err);
                setError(err?.response?.data?.message || "Failed to fetch shipper details");
            } finally {
                setLoading(false);
            }
        };

        if (shipperId) {
            fetchShipperDetails();
        }
    }, [shipperId]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading shipper details...</p>
                </div>
            </div>
        );
    }

    if (error || !shipper) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <X className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        {error || "Shipper not found"}
                    </h2>
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case "active":
                return (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-sm">
                        <Check className="h-4 w-4 mr-2" />
                        Active
                    </span>
                );
            case "inactive":
                return (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold shadow-sm">
                        <X className="h-4 w-4 mr-2" />
                        Inactive
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-sm">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-sm">
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    const kycBadge = shipper.kyc_verified === "1" || shipper.kyc_verified?.toLowerCase() === "yes" ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            KYC Verified
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            KYC Pending
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shippers
                    </Button>
                </motion.div>

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-6 mb-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                    className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden"
                                >
                                    {shipper.profile_image ? (
                                        <img
                                            src={shipper.profile_image}
                                            alt={shipper.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">
                                            {shipper.name?.substring(0, 2).toUpperCase() || "SH"}
                                        </span>
                                    )}
                                </motion.div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-700">
                                                {shipper.company_name || shipper.name}
                                            </h1>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {shipper.unique_id}
                                            </p>
                                            {shipper.company_name && (
                                                <p className="text-gray-600 mt-1 font-medium">
                                                    {shipper.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {kycBadge}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        {shipper.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <a
                                                    href={`mailto:${shipper.email}`}
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                                >
                                                    {shipper.email}
                                                </a>
                                            </div>
                                        )}
                                        {shipper.mobile && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <a
                                                    href={`tel:${shipper.mobile}`}
                                                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                                                >
                                                    {shipper.mobile}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid gap-4 sm:grid-cols-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 px-4 py-3 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Total Loads
                                    </p>
                                    <p className="text-lg font-bold text-blue-700 mt-1">
                                        {shipper.load_count || 0}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 px-4 py-3 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Total Ratings
                                    </p>
                                    <p className="text-lg font-bold text-orange-700 mt-1">
                                        {shipper.total_ratings || 0}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Avg Rating
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center text-amber-500">
                                            <Star className="h-5 w-5 fill-current" />
                                            <span className="text-lg font-bold ml-1 text-gray-800">
                                                {shipper.average_rating || 0}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">/ 5.0</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 px-4 py-3 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Status
                                    </p>
                                    <p className="text-lg font-bold text-green-700 mt-1 capitalize">
                                        {shipper.status || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {shipper.email && (
                                    <Button
                                        variant="outline"
                                        className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                                        onClick={() => window.location.href = `mailto:${shipper.email}`}
                                    >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Email
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all"
                                    onClick={() => window.location.href = `tel:${shipper.mobile}`}
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* KYC Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                KYC Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-8">
                                {/* Company Registration */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    className="relative"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 w-1 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full" />
                                        <h3 className="text-base font-semibold text-gray-700">
                                            Company Registration
                                        </h3>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 pl-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Company Type
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.company_type || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                GST Number
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-mono font-semibold text-blue-600">
                                                    {shipper.gst_number || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {shipper.gst_number && (
                                            <div className="space-y-1 sm:col-span-2 relative">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    GST Document
                                                </label>
                                                <div
                                                    className="relative"
                                                    onMouseEnter={() => setHoveredDoc("gst")}
                                                    onMouseLeave={() => setHoveredDoc(null)}
                                                >
                                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 px-4 py-3 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                                                    <FileText className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-700">
                                                                        GST_Certificate.pdf
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Hover to preview
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Eye className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    {hoveredDoc === "gst" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-blue-300 rounded-lg shadow-2xl p-4"
                                                        >
                                                            <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <FileText className="h-14 w-14 text-gray-400 mx-auto mb-3" />
                                                                    <p className="text-base font-semibold text-gray-700">
                                                                        GST Certificate
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        Document Preview
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Personal / Contact Details */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="relative border-t pt-6"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 w-1 bg-gradient-to-b from-violet-600 to-purple-400 rounded-full" />
                                        <h3 className="text-base font-semibold text-gray-700">
                                            Personal Details
                                        </h3>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 pl-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Full Name
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                PAN Number
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-mono font-semibold text-violet-600">
                                                    {shipper.pan_number || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Email
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.email || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Mobile
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.mobile}
                                                </p>
                                            </div>
                                        </div>

                                        {shipper.pan_number && (
                                            <div className="space-y-1 relative sm:col-span-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    PAN Document
                                                </label>
                                                <div
                                                    className="relative"
                                                    onMouseEnter={() => setHoveredDoc("pan")}
                                                    onMouseLeave={() => setHoveredDoc(null)}
                                                >
                                                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 px-4 py-3 rounded-lg hover:border-violet-500 hover:shadow-md transition-all cursor-pointer">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center">
                                                                    <FileText className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-700">
                                                                        PAN_Card.pdf
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Hover to preview
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Eye className="h-5 w-5 text-violet-600" />
                                                        </div>
                                                    </div>
                                                    {hoveredDoc === "pan" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute z-50 mt-2 w-96 bg-white border-2 border-violet-300 rounded-lg shadow-2xl p-4"
                                                        >
                                                            <div className="h-56 bg-gradient-to-br from-violet-100 to-purple-200 rounded flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <FileText className="h-14 w-14 text-violet-600 mx-auto mb-3" />
                                                                    <p className="text-base font-semibold text-gray-700">
                                                                        PAN Card
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        Document Preview
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Address Details */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                    className="relative border-t pt-6"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 w-1 bg-gradient-to-b from-orange-600 to-rose-400 rounded-full" />
                                        <h3 className="text-base font-semibold text-gray-700">
                                            Address Details
                                        </h3>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 pl-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                State
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.state || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                City
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {shipper.city || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2 space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Address
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {shipper.address || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                PIN Code
                                            </label>
                                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all">
                                                <p className="text-sm font-mono font-semibold text-orange-600">
                                                    {shipper.pincode || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bank Details */}
                {(shipper.bank_name || shipper.account_number) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-white" />
                                    </div>
                                    Bank Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Bank Name
                                        </label>
                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                                            <p className="text-sm font-medium text-gray-700">
                                                {shipper.bank_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Account Number
                                        </label>
                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                                            <p className="text-sm font-mono font-semibold text-purple-600">
                                                {shipper.account_number || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            IFSC Code
                                        </label>
                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                                            <p className="text-sm font-mono font-semibold text-gray-700">
                                                {shipper.ifsc_code || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Branch
                                        </label>
                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
                                            <p className="text-sm font-medium text-gray-700">
                                                {shipper.branch_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Account Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-1 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-full" />
                                <h3 className="text-base font-semibold text-gray-700">
                                    Account Status
                                </h3>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(shipper.status)}
                                    {shipper.created_at && (
                                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Joined: {new Date(shipper.created_at).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
            />
        </svg>
    );
}
