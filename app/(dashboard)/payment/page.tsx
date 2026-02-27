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

// --- Types ---
interface PaymentItem {
    id: number;
    load_id: string;
    shipper_id: string;
    trucker_id: string;
    shipper_name?: string;
    trucker_name?: string;
    shipper_total_amount: string;
    trucker_total_amount: string;
    shipper_paid_amount: string;
    trucker_received_amount: string;
    shipper_partial_paid_at: string | null;
    shipper_completed_paid_at: string | null;
    shipper_refunded_at: string | null;
    trucker_partial_received_at: string | null;
    trucker_completed_received_at: string | null;
    shipper_due_amount: string;
    trucker_due_amount: string;
    shipment_status: string;
    shipper_payment_status: string;
    trucker_payment_status: string;
    origin_location: string;
    destination_location: string;
    shipment_date: string;
    vehicle_number: string;
    driver_name: string;
    dl_number: string;
    driver_phone: string;
    builty_path: string | null;
    pod_path: string | null;
    overdue_date: string | null;
    created_at: string;
    updated_at: string;
}

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PaymentStats {
    total_received_from_shipper: number;
    total_paid_to_trucker: number;
    shipper_pending_payment: number;
    trucker_pending_payment: number;
}

const mockPayments: PaymentItem[] = [
    {
        "id": 1,
        "load_id": "LD10023",
        "shipper_id": "SHP001",
        "shipper_name": "Acme Logistics",
        "trucker_id": "TRK001",
        "trucker_name": "Rahul Transports",
        "shipper_total_amount": "50000",
        "trucker_total_amount": "45000",
        "shipper_paid_amount": "25000",
        "trucker_received_amount": "20000",
        "shipper_partial_paid_at": "2026-02-10T10:00:00Z",
        "shipper_completed_paid_at": null,
        "shipper_refunded_at": null,
        "trucker_partial_received_at": "2026-02-11T12:00:00Z",
        "trucker_completed_received_at": null,
        "shipper_due_amount": "25000",
        "trucker_due_amount": "25000",
        "shipment_status": "In Transit",
        "shipper_payment_status": "Partial",
        "trucker_payment_status": "Partial",
        "origin_location": "Mumbai, Maharashtra",
        "destination_location": "Delhi, NCR",
        "shipment_date": "2026-02-09T08:00:00Z",
        "vehicle_number": "MH04AB1234",
        "driver_name": "Ramesh Singh",
        "dl_number": "MH041999123456",
        "driver_phone": "9876543210",
        "builty_path": null,
        "pod_path": null,
        "overdue_date": "2026-03-09T08:00:00Z",
        "created_at": "2026-02-08T09:00:00Z",
        "updated_at": "2026-02-11T12:00:00Z"
    },
    {
        "id": 2,
        "load_id": "LD10024",
        "shipper_id": "SHP002",
        "shipper_name": "Global Traders",
        "trucker_id": "TRK002",
        "trucker_name": "Singh Roadways",
        "shipper_total_amount": "80000",
        "trucker_total_amount": "76000",
        "shipper_paid_amount": "0",
        "trucker_received_amount": "0",
        "shipper_partial_paid_at": null,
        "shipper_completed_paid_at": null,
        "shipper_refunded_at": null,
        "trucker_partial_received_at": null,
        "trucker_completed_received_at": null,
        "shipper_due_amount": "80000",
        "trucker_due_amount": "76000",
        "shipment_status": "Pending",
        "shipper_payment_status": "Pending",
        "trucker_payment_status": "Pending",
        "origin_location": "Pune, Maharashtra",
        "destination_location": "Bangalore, Karnataka",
        "shipment_date": "2026-02-12T08:00:00Z",
        "vehicle_number": "MH12CD5678",
        "driver_name": "Suresh Kumar",
        "dl_number": "MH122000345678",
        "driver_phone": "8765432109",
        "builty_path": null,
        "pod_path": null,
        "overdue_date": "2026-03-12T08:00:00Z",
        "created_at": "2026-02-10T09:00:00Z",
        "updated_at": "2026-02-10T09:00:00Z"
    }
];

export default function PaymentPage() {
    const router = useRouter();
    const [data, setData] = useState<PaymentItem[]>([]);
    const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
    const [stats, setStats] = useState<PaymentStats>({ total_received_from_shipper: 0, total_paid_to_trucker: 0, shipper_pending_payment: 0, trucker_pending_payment: 0 });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "partial" | "completed">("all");
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
            try {
                // Simulating API Fetch due to lack of standard endpoint given, replacing with mock
                // const response = await apiClient.get(`/api/payments?page=${currentPage}&status=${filterStatus}`);

                await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay

                // Mock processing logic
                let filtered = mockPayments;
                if (filterStatus !== "all") {
                    filtered = filtered.filter(p => p.shipper_payment_status.toLowerCase() === filterStatus || p.trucker_payment_status.toLowerCase() === filterStatus);
                }
                if (searchQuery) {
                    filtered = filtered.filter(p => p.load_id.toLowerCase().includes(searchQuery.toLowerCase()) || p.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()));
                }

                setData(filtered);
                setMeta({ current_page: 1, last_page: 1, per_page: 10, total: filtered.length });

                // Mock stats
                setStats({
                    total_received_from_shipper: mockPayments.reduce((acc, curr) => acc + parseFloat(curr.shipper_paid_amount || "0"), 0),
                    total_paid_to_trucker: mockPayments.reduce((acc, curr) => acc + parseFloat(curr.trucker_received_amount || "0"), 0),
                    shipper_pending_payment: mockPayments.reduce((acc, curr) => acc + parseFloat(curr.shipper_due_amount || "0"), 0),
                    trucker_pending_payment: mockPayments.reduce((acc, curr) => acc + parseFloat(curr.trucker_due_amount || "0"), 0),
                });

            } catch (err: any) {
                setError("Failed to fetch payments data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [currentPage, filterStatus, searchQuery]);

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
            case "in transit": return "text-gray-700 border-gray-200 bg-gray-50";
            default: return "text-gray-600 border-gray-200 bg-gray-50";
        }
    };

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
                        placeholder="Search by Load ID or Vehicle Number..."
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
                                    {["all", "pending", "partial", "completed"].map((status) => (
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
                Showing <span className="text-gray-900 font-bold">{data.length}</span> of <span className="text-gray-900 font-bold">{meta.total}</span> payments
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
                        {data.map((payment) => (
                            <motion.div key={payment.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white rounded-xl">
                                    {/* Card Header Route */}
                                    <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-1">{payment.load_id}</p>
                                            <div className="flex items-center gap-2 text-[14px] font-bold text-[#0f172a]">
                                                <span className="truncate" title={payment.origin_location.split(',')[0]}>{payment.origin_location.split(',')[0]}</span>
                                                <ChevronRight className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                                <span className="truncate" title={payment.destination_location.split(',')[0]}>{payment.destination_location.split(',')[0]}</span>
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
                                                    <p className="text-[12px] font-bold text-[#0f172a] truncate">{payment.shipper_name || payment.shipper_id}</p>
                                                    <p className="text-[9px] font-medium text-[#94a3b8]">{payment.shipper_id}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-[10px] font-medium text-[#64748b] mb-0.5">Total Bill</p>
                                                    <p className="text-[18px] font-extrabold text-[#0f172a] tracking-tight">{formatCurrency(payment.shipper_total_amount)}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#f0fdf4] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Received</p>
                                                        <p className="text-[12px] font-extrabold text-emerald-700">{formatCurrency(payment.shipper_paid_amount)}</p>
                                                    </div>
                                                    <div className="bg-[#fef2f2] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-red-600 font-bold uppercase tracking-wider mb-0.5">Due</p>
                                                        <p className="text-[12px] font-extrabold text-red-700">{formatCurrency(payment.shipper_due_amount)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Badge className="text-[9px] font-semibold bg-gray-100/80 text-gray-500 hover:bg-gray-100/80 border-none px-2 py-0.5">{payment.shipper_payment_status}</Badge>
                                                    {payment.shipper_partial_paid_at && (
                                                        <span className="text-[9px] text-gray-400 font-bold">{formatDate(payment.shipper_partial_paid_at)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trucker Side */}
                                        <div className="pl-3">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Truck className="h-3.5 w-3.5 text-blue-600 stroke-[2.5] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-[#0f172a] truncate">{payment.trucker_name || payment.trucker_id}</p>
                                                    <p className="text-[9px] font-medium text-[#94a3b8]">{payment.trucker_id}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-[10px] font-medium text-[#64748b] mb-0.5">Total Payload</p>
                                                    <p className="text-[18px] font-extrabold text-[#0f172a] tracking-tight">{formatCurrency(payment.trucker_total_amount)}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#f0fdf4] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Paid</p>
                                                        <p className="text-[12px] font-extrabold text-emerald-700">{formatCurrency(payment.trucker_received_amount)}</p>
                                                    </div>
                                                    <div className="bg-[#fef2f2] rounded-md text-center py-2 px-1">
                                                        <p className="text-[8px] text-red-600 font-bold uppercase tracking-wider mb-0.5">Due</p>
                                                        <p className="text-[12px] font-extrabold text-red-700">{formatCurrency(payment.trucker_due_amount)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Badge className="text-[9px] font-semibold bg-gray-100/80 hover:bg-gray-100/80 text-gray-500 border-none px-2 py-0.5">{payment.trucker_payment_status}</Badge>
                                                    {payment.trucker_partial_received_at && (
                                                        <span className="text-[9px] text-gray-400 font-bold">{formatDate(payment.trucker_partial_received_at)}</span>
                                                    )}
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
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Shipper Bill</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Trucker Pay</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Shipment Date</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Status</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">Overdue Date</th>
                                            <th className="py-5 px-8 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 px-8">
                                                    <span className="text-[14px] font-bold text-[#0f172a]">{payment.load_id}</span>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div>
                                                        <span className="text-[14px] font-bold text-[#334155] block">{payment.shipper_name || payment.shipper_id}</span>
                                                        <span className="text-[11px] font-medium text-[#94a3b8]">{payment.shipper_id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div>
                                                        <span className="text-[14px] font-bold text-[#334155] block">{payment.trucker_name || payment.trucker_id}</span>
                                                        <span className="text-[11px] font-medium text-[#94a3b8]">{payment.trucker_id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 min-w-[260px]">
                                                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#475569]">
                                                        <span className="truncate max-w-[120px]" title={payment.origin_location}>{payment.origin_location.split(',')[0]}</span>
                                                        <span className="text-gray-300">→</span>
                                                        <span className="truncate max-w-[120px]" title={payment.destination_location}>{payment.destination_location.split(',')[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap min-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-extrabold text-[#0f172a]">{formatCurrency(payment.shipper_total_amount)}</span>
                                                        <div className="flex items-center gap-2 text-[12px] mt-1.5">
                                                            <span className="text-emerald-600 font-semibold border-r border-gray-200 pr-2">Recv: {formatCurrency(payment.shipper_paid_amount)}</span>
                                                            <span className="text-red-500 font-semibold">Due: {formatCurrency(payment.shipper_due_amount)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8 whitespace-nowrap min-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-[16px] font-extrabold text-[#0f172a]">{formatCurrency(payment.trucker_total_amount)}</span>
                                                        <div className="flex items-center gap-2 text-[12px] mt-1.5">
                                                            <span className="text-emerald-600 font-semibold border-r border-gray-200 pr-2">Paid: {formatCurrency(payment.trucker_received_amount)}</span>
                                                            <span className="text-red-500 font-semibold">Due: {formatCurrency(payment.trucker_due_amount)}</span>
                                                        </div>
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

            {/* Pagination Container */}
            {data.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
                    <div className="text-sm text-[#64748b]">
                        Showing <span className="font-semibold">{data.length}</span> results
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="text-sm font-medium text-gray-500 px-4">
                            Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{meta.last_page}</span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                            disabled={currentPage === meta.last_page}
                            className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(meta.last_page)}
                            disabled={currentPage === meta.last_page}
                            className="h-10 w-10 p-0 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
