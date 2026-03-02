"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search, Filter, Grid3x3, List, AlertTriangle,
    TrendingUp, CreditCard, Activity, CheckCircle2, AlertCircle, Loader2,
    ChevronRight, ChevronLeft, MapPin, Truck, Calendar, User, Phone,
    ChevronsLeft, ChevronsRight, IndianRupee, RotateCcw,
    Receipt, Wallet, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import EmptyState from "@/components/ui/EmptyState";

// --- Types matching API response ---
interface PaymentItem {
    id: number;
    load_id: string;
    shipment_date: string | null;
    shipment_status: string;
    origin_location: string | null;
    destination_location: string | null;
    shipper_name: string | null;
    shipper_tmid: string | null;
    trucker_name: string | null;
    trucker_tmid: string | null;
    shipper_paid_amount: string;
    trucker_received_amount: string;
    shipper_due_amount: string;
    trucker_due_amount: string;
    overdue_date?: string | null;
}

interface PaymentTotals {
    total_shipper_paid: string;
    total_trucker_received: string;
    total_shipper_due: string;
    total_trucker_due: string;
}

interface PaymentStats {
    total_received_from_shipper: number;
    total_paid_to_trucker: number;
    shipper_pending_payment: number;
    trucker_pending_payment: number;
}

export default function PaymentPage() {
    const router = useRouter();
    const [data, setData] = useState<PaymentItem[]>([]);
    const [stats, setStats] = useState<PaymentStats>({ total_received_from_shipper: 0, total_paid_to_trucker: 0, shipper_pending_payment: 0, trucker_pending_payment: 0 });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "partial" | "completed" | "accepted">("all");
    const filterRef = useRef<HTMLDivElement>(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        if (showFilters) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilters]);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get("/api/dashboard/settlements/totals");

                if (response.data && response.data.status) {
                    const apiData = response.data.data || [];
                    const totals: PaymentTotals = response.data.totals || {
                        total_shipper_paid: "0",
                        total_trucker_received: "0",
                        total_shipper_due: "0",
                        total_trucker_due: "0",
                    };

                    setData(apiData);

                    setStats({
                        total_received_from_shipper: parseFloat(totals.total_shipper_paid || "0"),
                        total_paid_to_trucker: parseFloat(totals.total_trucker_received || "0"),
                        shipper_pending_payment: parseFloat(totals.total_shipper_due || "0"),
                        trucker_pending_payment: parseFloat(totals.total_trucker_due || "0"),
                    });
                } else {
                    setData([]);
                    setError("No data returned from API.");
                }
            } catch (err: any) {
                console.error("Failed to fetch settlements:", err);
                setError("Failed to fetch payments data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount));
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed": return "text-emerald-700 border-emerald-200 bg-emerald-50";
            case "partial": return "text-blue-700 border-blue-200 bg-blue-50";
            case "pending": return "text-orange-700 border-orange-200 bg-orange-50";
            case "accepted": return "text-indigo-700 border-indigo-200 bg-indigo-50";
            case "in transit": return "text-gray-700 border-gray-200 bg-gray-50";
            default: return "text-gray-600 border-gray-200 bg-gray-50";
        }
    };

    // Client-side filtering
    const filteredData = useMemo(() => {
        let filtered = data;
        if (filterStatus !== "all") {
            filtered = filtered.filter(p => p.shipment_status?.toLowerCase() === filterStatus);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.load_id?.toLowerCase().includes(q) ||
                p.shipper_name?.toLowerCase().includes(q) ||
                p.shipper_tmid?.toLowerCase().includes(q) ||
                p.trucker_name?.toLowerCase().includes(q) ||
                p.trucker_tmid?.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [data, filterStatus, searchQuery]);

    if (loading && data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <h3 className="text-lg font-bold text-gray-800">Loading Payments...</h3>
            </div>
        );
    }

    if (error && data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-gray-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[#1e293b]">Payments</h1>
                <p className="text-sm text-gray-500">Manage Shipper and Trucker load payments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-[#10b981] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
                    <div className="flex justify-between items-start">
                        <Wallet className="h-8 w-8 opacity-90" />
                        <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Received</Badge>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-bold">{formatCurrency(stats.total_received_from_shipper)}</p>
                        <p className="text-sm font-medium opacity-90 mt-1">Total Received from Shipper</p>
                    </div>
                </Card>

                <Card className="bg-[#2563eb] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
                    <div className="flex justify-between items-start">
                        <Truck className="h-8 w-8 opacity-90" />
                        <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Paid</Badge>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-bold">{formatCurrency(stats.total_paid_to_trucker)}</p>
                        <p className="text-sm font-medium opacity-90 mt-1">Total Paid to Trucker</p>
                    </div>
                </Card>

                <Card className="bg-[#f97316] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
                    <div className="flex justify-between items-start">
                        <AlertTriangle className="h-8 w-8 opacity-90" />
                        <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Pending</Badge>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-bold">{formatCurrency(stats.shipper_pending_payment)}</p>
                        <p className="text-sm font-medium opacity-90 mt-1">Shipper Pending Payment</p>
                    </div>
                </Card>

                <Card className="bg-[#a855f7] border-none shadow-md p-6 text-white relative h-36 rounded-2xl">
                    <div className="flex justify-between items-start">
                        <TrendingUp className="h-8 w-8 opacity-90" />
                        <Badge className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold px-2 py-0.5">Pending</Badge>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-bold">{formatCurrency(stats.trucker_pending_payment)}</p>
                        <p className="text-sm font-medium opacity-90 mt-1">Trucker Pending Payment</p>
                    </div>
                </Card>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search by Load ID, Shipper or Trucker..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm placeholder:text-gray-300"
                    />
                    {loading && (
                        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 animate-spin" />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-xl border border-gray-100 flex gap-0.5 shadow-sm h-14 items-center px-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#2563eb] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                        >
                            <Grid3x3 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#2563eb] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                        >
                            <List className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="relative" ref={filterRef}>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className={`h-14 px-6 rounded-xl border-gray-100 shadow-sm font-semibold flex gap-3 ${showFilters ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                        >
                            <Filter className="h-5 w-5" />
                            Filters
                        </Button>

                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-10"
                            >
                                <div className="space-y-1">
                                    {["all", "accepted", "pending", "completed"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status as any)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all capitalize ${filterStatus === status ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-sm font-medium text-gray-500">
                Showing <span className="text-gray-900 font-bold">{filteredData.length}</span> of <span className="text-gray-900 font-bold">{data.length}</span> payments
            </p>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    <motion.div
                        key="grid"
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {filteredData.map((payment, index) => (
                            <motion.div key={payment.load_id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white rounded-xl">
                                    {/* Card Header Route */}
                                    <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-1">{payment.load_id}</p>
                                            <div className="flex items-center gap-2 text-[14px] font-bold text-[#0f172a]">
                                                <span className="truncate" title={payment.origin_location || 'N/A'}>{payment.origin_location ? payment.origin_location.split(',')[0] : 'N/A'}</span>
                                                <ChevronRight className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                                <span className="truncate" title={payment.destination_location || 'N/A'}>{payment.destination_location ? payment.destination_location.split(',')[0] : 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className={`flex-shrink-0 text-[9px] uppercase font-bold border rounded-full px-2.5 py-0.5 tracking-wider ${getStatusColor(payment.shipment_status)}`}>
                                            {payment.shipment_status}
                                        </div>
                                    </div>

                                    <div className="px-4 py-4 grid grid-cols-2 relative bg-white gap-0">
                                        {/* Middle Border Divider */}
                                        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-100 -translate-x-1/2"></div>

                                        {/* Shipper Side */}
                                        <div className="pr-3">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <User className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-[#0f172a] truncate">{payment.shipper_name || 'N/A'}</p>
                                                    <p className="text-[9px] font-medium text-[#94a3b8]">{payment.shipper_tmid || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#f0fdf4] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Paid</p>
                                                        <p className="text-[12px] font-extrabold text-emerald-700">{formatCurrency(payment.shipper_paid_amount)}</p>
                                                    </div>
                                                    <div className="bg-[#fef2f2] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-red-600 font-bold uppercase tracking-wider mb-0.5">Due</p>
                                                        <p className="text-[12px] font-extrabold text-red-700">{formatCurrency(payment.shipper_due_amount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trucker Side */}
                                        <div className="pl-3">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Truck className="h-3.5 w-3.5 text-blue-600 stroke-[2.5] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-[#0f172a] truncate">{payment.trucker_name || 'N/A'}</p>
                                                    <p className="text-[9px] font-medium text-[#94a3b8]">{payment.trucker_tmid || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#f0fdf4] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Received</p>
                                                        <p className="text-[12px] font-extrabold text-emerald-700">{formatCurrency(payment.trucker_received_amount)}</p>
                                                    </div>
                                                    <div className="bg-[#fef2f2] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-red-600 font-bold uppercase tracking-wider mb-0.5">Due</p>
                                                        <p className="text-[12px] font-extrabold text-red-700">{formatCurrency(payment.trucker_due_amount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overdue Date */}
                                    {payment.overdue_date && (
                                        <div className="px-4 py-2 bg-red-50/60 border-t border-red-100 flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-red-500" />
                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Overdue:</span>
                                            <span className="text-[11px] font-bold text-red-600">{formatDate(payment.overdue_date)}</span>
                                        </div>
                                    )}

                                    {/* Footer View Details */}
                                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                                        <Button onClick={() => router.push(`/payment/payment-detail?id=${payment.id}`)} variant="outline" size="sm" className="w-full h-9 bg-white text-blue-600 border-gray-200 hover:bg-blue-50/50 hover:border-blue-300 hover:text-blue-700 shadow-sm font-semibold text-[12px] rounded-lg transition-all">
                                            View Details
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-b border-gray-200">
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Load ID</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Shipper Name</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Trucker Name</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Route</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Shipper Paid</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Trucker Received</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Shipment Date</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Status</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Overdue Date</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filteredData.map((payment) => (
                                            <tr key={payment.load_id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 px-8">
                                                    <span className="text-[14px] font-bold text-[#0f172a]">{payment.load_id}</span>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div>
                                                        <span className="text-[14px] font-bold text-[#334155] block">{payment.shipper_name || 'N/A'}</span>
                                                        <span className="text-[11px] font-medium text-[#94a3b8]">{payment.shipper_tmid || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div>
                                                        <span className="text-[14px] font-bold text-[#334155] block">{payment.trucker_name || 'N/A'}</span>
                                                        <span className="text-[11px] font-medium text-[#94a3b8]">{payment.trucker_tmid || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 min-w-[260px]">
                                                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#475569]">
                                                        <span className="truncate max-w-[120px]" title={payment.origin_location || 'N/A'}>{payment.origin_location ? payment.origin_location.split(',')[0] : 'N/A'}</span>
                                                        <span className="text-gray-300">→</span>
                                                        <span className="truncate max-w-[120px]" title={payment.destination_location || 'N/A'}>{payment.destination_location ? payment.destination_location.split(',')[0] : 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap min-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-extrabold text-emerald-700">{formatCurrency(payment.shipper_paid_amount)}</span>
                                                        <span className="text-[12px] text-red-500 font-semibold mt-1">Due: {formatCurrency(payment.shipper_due_amount)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap min-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-extrabold text-emerald-700">{formatCurrency(payment.trucker_received_amount)}</span>
                                                        <span className="text-[12px] text-red-500 font-semibold mt-1">Due: {formatCurrency(payment.trucker_due_amount)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap">
                                                    <span className="text-[14px] font-semibold text-[#475569]">{formatDate(payment.shipment_date)}</span>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap">
                                                    <div className={`inline-flex items-center text-[11px] uppercase font-bold border rounded-full px-3 py-1 tracking-wider ${getStatusColor(payment.shipment_status)}`}>
                                                        {payment.shipment_status}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap">
                                                    {payment.overdue_date ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5 text-red-500" />
                                                            <span className="text-[13px] font-bold text-red-600">{formatDate(payment.overdue_date)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[13px] text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                                <td className="py-5 px-8 text-right whitespace-nowrap min-w-[160px]">
                                                    <Button onClick={() => router.push(`/payment/payment-detail?id=${payment.id}`)} variant="outline" size="sm" className="h-9 px-4 bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-100/50 hover:border-blue-200 hover:text-blue-700 shadow-none font-bold text-[13px] rounded-lg w-full">
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredData.length === 0 && (
                <EmptyState
                    title="No Payments Found"
                    message="Try adjusting your search or filter criteria"
                />
            )}

            {/* Pagination Container */}
            {filteredData.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
                    <div className="text-sm text-[#64748b]">
                        Showing <span className="font-semibold">{filteredData.length}</span> results
                    </div>
                </div>
            )}
        </div>
    );
}
