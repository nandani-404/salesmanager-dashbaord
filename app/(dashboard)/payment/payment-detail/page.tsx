"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, MapPin, Truck, Calendar, User, Phone, CreditCard, Download,
    IndianRupee, FileText, Clock, CheckCircle2, AlertCircle, AlertTriangle,
    Loader2, ChevronRight, Hash, Receipt, Wallet, Shield,
    Image as ImageIcon, RotateCcw, Package, Navigation
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

// Mock data matching the payment page
const mockPayments: PaymentItem[] = [
    {
        id: 1,
        load_id: "LD10023",
        shipper_id: "SHP001",
        shipper_name: "Acme Logistics",
        trucker_id: "TRK001",
        trucker_name: "Rahul Transports",
        shipper_total_amount: "50000",
        trucker_total_amount: "45000",
        shipper_paid_amount: "25000",
        trucker_received_amount: "20000",
        shipper_partial_paid_at: "2026-02-10T10:00:00Z",
        shipper_completed_paid_at: null,
        shipper_refunded_at: null,
        trucker_partial_received_at: "2026-02-11T12:00:00Z",
        trucker_completed_received_at: null,
        shipper_due_amount: "25000",
        trucker_due_amount: "25000",
        shipment_status: "In Transit",
        shipper_payment_status: "Partial",
        trucker_payment_status: "Partial",
        origin_location: "Mumbai, Maharashtra",
        destination_location: "Delhi, NCR",
        shipment_date: "2026-02-09T08:00:00Z",
        vehicle_number: "MH04AB1234",
        driver_name: "Ramesh Singh",
        dl_number: "MH041999123456",
        driver_phone: "9876543210",
        builty_path: null,
        pod_path: null,
        overdue_date: "2026-03-09T08:00:00Z",
        created_at: "2026-02-08T09:00:00Z",
        updated_at: "2026-02-11T12:00:00Z"
    },
    {
        id: 2,
        load_id: "LD10024",
        shipper_id: "SHP002",
        shipper_name: "Global Traders",
        trucker_id: "TRK002",
        trucker_name: "Singh Roadways",
        shipper_total_amount: "80000",
        trucker_total_amount: "76000",
        shipper_paid_amount: "0",
        trucker_received_amount: "0",
        shipper_partial_paid_at: null,
        shipper_completed_paid_at: null,
        shipper_refunded_at: null,
        trucker_partial_received_at: null,
        trucker_completed_received_at: null,
        shipper_due_amount: "80000",
        trucker_due_amount: "76000",
        shipment_status: "Pending",
        shipper_payment_status: "Pending",
        trucker_payment_status: "Pending",
        origin_location: "Pune, Maharashtra",
        destination_location: "Bangalore, Karnataka",
        shipment_date: "2026-02-12T08:00:00Z",
        vehicle_number: "MH12CD5678",
        driver_name: "Suresh Kumar",
        dl_number: "MH122000345678",
        driver_phone: "8765432109",
        builty_path: null,
        pod_path: null,
        overdue_date: "2026-03-12T08:00:00Z",
        created_at: "2026-02-10T09:00:00Z",
        updated_at: "2026-02-10T09:00:00Z"
    }
];

// --- Helper Component: Info Row ---
function InfoRow({ icon: Icon, label, value, valueColor, iconColor }: {
    icon: any;
    label: string;
    value: string;
    valueColor?: string;
    iconColor?: string;
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
            <div className={`mt-0.5 p-1.5 rounded-lg ${iconColor || "bg-gray-50"}`}>
                <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-0.5">{label}</p>
                <p className={`text-[14px] font-semibold truncate ${valueColor || "text-[#1e293b]"}`}>{value}</p>
            </div>
        </div>
    );
}

// --- Helper Component: Amount Card ---
function AmountCard({ label, amount, bgColor, textColor, labelColor }: {
    label: string;
    amount: string;
    bgColor: string;
    textColor: string;
    labelColor: string;
}) {
    return (
        <div className={`${bgColor} rounded-xl p-4 text-center`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${labelColor} mb-1.5`}>{label}</p>
            <p className={`text-[20px] font-extrabold ${textColor} tracking-tight`}>{amount}</p>
        </div>
    );
}

export default function PaymentDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("id");

    const [payment, setPayment] = useState<PaymentItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentDetail = async () => {
            setLoading(true);
            try {
                // Simulating API call - replace with actual API
                // const response = await apiClient.get(`/api/payments/${paymentId}`);
                await new Promise(resolve => setTimeout(resolve, 600));

                const found = mockPayments.find(p => p.id === Number(paymentId)) || mockPayments[0];
                setPayment(found);
            } catch (err) {
                console.error("Failed to fetch payment detail");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetail();
    }, [paymentId]);

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

    const formatDateTime = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed": return "text-emerald-700 border-emerald-200 bg-emerald-50";
            case "partial": return "text-blue-700 border-blue-200 bg-blue-50";
            case "pending": return "text-orange-700 border-orange-200 bg-orange-50";
            case "in transit": return "text-violet-700 border-violet-200 bg-violet-50";
            default: return "text-gray-600 border-gray-200 bg-gray-50";
        }
    };

    const getShipmentStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed": return <CheckCircle2 className="h-4 w-4" />;
            case "in transit": return <Truck className="h-4 w-4" />;
            case "pending": return <Clock className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <h3 className="text-lg font-bold text-gray-800">Loading Payment Details...</h3>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-gray-500">Payment not found.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 bg-[#F8FAFC] min-h-screen">
            {/* Page Header with Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="h-10 w-10 p-0 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1e293b]">Payment Details</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-gray-600">{payment.load_id}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[12px] text-gray-400">{formatDate(payment.created_at)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 text-[12px] uppercase font-bold border rounded-full px-4 py-2 tracking-wider ${getStatusColor(payment.shipment_status)}`}>
                        {getShipmentStatusIcon(payment.shipment_status)}
                        {payment.shipment_status}
                    </div>
                </div>
            </motion.div>

            {/* Route Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <Card className="border border-gray-200 shadow-sm bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-2xl overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">Origin</p>
                                <p className="text-[18px] font-bold">{payment.origin_location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-1">
                                <div className="w-8 h-[2px] bg-white/30 rounded-full"></div>
                                <div className="w-3 h-[2px] bg-white/50 rounded-full"></div>
                                <div className="w-2 h-[2px] bg-white/70 rounded-full"></div>
                            </div>
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                <Navigation className="h-5 w-5 text-white" />
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                                <div className="w-2 h-[2px] bg-white/70 rounded-full"></div>
                                <div className="w-3 h-[2px] bg-white/50 rounded-full"></div>
                                <div className="w-8 h-[2px] bg-white/30 rounded-full"></div>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">Destination</p>
                            <p className="text-[18px] font-bold">{payment.destination_location}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* === LEFT COLUMN === */}
                <div className="space-y-6">

                    {/* Shipper Payment Details */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <User className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">Shipper Payment</h3>
                                    <p className="text-[12px] text-gray-400 font-medium">{payment.shipper_name || payment.shipper_id} • {payment.shipper_id}</p>
                                </div>
                                <Badge className={`ml-auto text-[10px] uppercase font-bold border rounded-full px-3 py-1 tracking-wider ${getStatusColor(payment.shipper_payment_status)}`}>
                                    {payment.shipper_payment_status}
                                </Badge>
                            </div>
                            <div className="p-5">
                                {/* Total Amount */}
                                <div className="text-center mb-5 py-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Bill Amount</p>
                                    <p className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">{formatCurrency(payment.shipper_total_amount)}</p>
                                </div>

                                {/* Amount Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <AmountCard
                                        label="Paid Amount"
                                        amount={formatCurrency(payment.shipper_paid_amount)}
                                        bgColor="bg-emerald-50"
                                        textColor="text-emerald-700"
                                        labelColor="text-emerald-600"
                                    />
                                    <AmountCard
                                        label="Due Amount"
                                        amount={formatCurrency(payment.shipper_due_amount)}
                                        bgColor="bg-red-50"
                                        textColor="text-red-700"
                                        labelColor="text-red-600"
                                    />
                                </div>

                                {/* Dates */}
                                <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden">
                                    <InfoRow
                                        icon={Clock}
                                        label="Partial Paid At"
                                        value={formatDateTime(payment.shipper_partial_paid_at)}
                                        iconColor="bg-blue-50"
                                    />
                                    <InfoRow
                                        icon={CheckCircle2}
                                        label="Completed Paid At"
                                        value={formatDateTime(payment.shipper_completed_paid_at)}
                                        iconColor="bg-emerald-50"
                                        valueColor={payment.shipper_completed_paid_at ? "text-emerald-700" : "text-gray-400"}
                                    />
                                    <InfoRow
                                        icon={RotateCcw}
                                        label="Refunded At"
                                        value={formatDateTime(payment.shipper_refunded_at)}
                                        iconColor="bg-orange-50"
                                        valueColor={payment.shipper_refunded_at ? "text-orange-700" : "text-gray-400"}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Driver & Vehicle Details */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-violet-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-violet-100 rounded-xl">
                                    <Truck className="h-5 w-5 text-violet-600" />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#0f172a]">Driver & Vehicle Info</h3>
                            </div>
                            <div className="p-5 space-y-0">
                                <InfoRow
                                    icon={User}
                                    label="Driver Name"
                                    value={payment.driver_name}
                                    iconColor="bg-violet-50"
                                />
                                <InfoRow
                                    icon={Phone}
                                    label="Driver Phone"
                                    value={payment.driver_phone}
                                    iconColor="bg-green-50"
                                />
                                <InfoRow
                                    icon={Shield}
                                    label="DL Number"
                                    value={payment.dl_number}
                                    iconColor="bg-amber-50"
                                />
                                <InfoRow
                                    icon={Truck}
                                    label="Vehicle Number"
                                    value={payment.vehicle_number}
                                    iconColor="bg-blue-50"
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Payment Invoice */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-xl">
                                    <Receipt className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#0f172a]">Payment Invoice</h3>
                            </div>
                            <div className="p-5">
                                {/* Invoice Info */}
                                <div className="bg-gray-50/50 border border-gray-100/50 rounded-xl p-4 mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Invoice No.</p>
                                        <p className="text-[14px] font-bold text-[#0f172a]">INV-{payment.load_id}-{String(payment.id).padStart(4, '0')}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Invoice Date</p>
                                        <p className="text-[14px] font-semibold text-[#475569]">{formatDate(payment.created_at)}</p>
                                    </div>
                                </div>

                                {/* Amount Breakdown */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Shipper Total</span>
                                        <span className="text-[14px] font-bold text-[#1e293b]">{formatCurrency(payment.shipper_total_amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Trucker Total</span>
                                        <span className="text-[14px] font-bold text-[#1e293b]">{formatCurrency(payment.trucker_total_amount)}</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 my-1"></div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] font-bold text-gray-600">Margin</span>
                                        <span className="text-[16px] font-extrabold text-emerald-600">
                                            {formatCurrency(Number(payment.shipper_total_amount) - Number(payment.trucker_total_amount))}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Shipper Paid</span>
                                        <span className="text-[14px] font-semibold text-emerald-600">{formatCurrency(payment.shipper_paid_amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Shipper Due</span>
                                        <span className="text-[14px] font-semibold text-red-500">{formatCurrency(payment.shipper_due_amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Trucker Paid</span>
                                        <span className="text-[14px] font-semibold text-emerald-600">{formatCurrency(payment.trucker_received_amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[13px] text-gray-500">Trucker Due</span>
                                        <span className="text-[14px] font-semibold text-red-500">{formatCurrency(payment.trucker_due_amount)}</span>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <Button
                                    variant="outline"
                                    className="w-full h-11 bg-indigo-50/50 text-indigo-600 border-indigo-200 hover:bg-indigo-100/50 hover:border-indigo-300 hover:text-indigo-700 shadow-sm font-bold text-[13px] rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Invoice
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* === RIGHT COLUMN === */}
                <div className="space-y-6">

                    {/* Trucker Payment Details */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">Trucker Payment</h3>
                                    <p className="text-[12px] text-gray-400 font-medium">{payment.trucker_name || payment.trucker_id} • {payment.trucker_id}</p>
                                </div>
                                <Badge className={`ml-auto text-[10px] uppercase font-bold border rounded-full px-3 py-1 tracking-wider ${getStatusColor(payment.trucker_payment_status)}`}>
                                    {payment.trucker_payment_status}
                                </Badge>
                            </div>
                            <div className="p-5">
                                {/* Total Amount */}
                                <div className="text-center mb-5 py-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Trucker Amount</p>
                                    <p className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">{formatCurrency(payment.trucker_total_amount)}</p>
                                </div>

                                {/* Amount Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <AmountCard
                                        label="Received Amount"
                                        amount={formatCurrency(payment.trucker_received_amount)}
                                        bgColor="bg-emerald-50"
                                        textColor="text-emerald-700"
                                        labelColor="text-emerald-600"
                                    />
                                    <AmountCard
                                        label="Due Amount"
                                        amount={formatCurrency(payment.trucker_due_amount)}
                                        bgColor="bg-red-50"
                                        textColor="text-red-700"
                                        labelColor="text-red-600"
                                    />
                                </div>

                                {/* Dates */}
                                <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden">
                                    <InfoRow
                                        icon={Clock}
                                        label="Partial Received At"
                                        value={formatDateTime(payment.trucker_partial_received_at)}
                                        iconColor="bg-blue-50"
                                    />
                                    <InfoRow
                                        icon={CheckCircle2}
                                        label="Completed Received At"
                                        value={formatDateTime(payment.trucker_completed_received_at)}
                                        iconColor="bg-emerald-50"
                                        valueColor={payment.trucker_completed_received_at ? "text-emerald-700" : "text-gray-400"}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Shipment & Load Details */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-xl">
                                    <Package className="h-5 w-5 text-amber-600" />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#0f172a]">Shipment Details</h3>
                            </div>
                            <div className="p-5 space-y-0">
                                <InfoRow
                                    icon={Hash}
                                    label="Load ID"
                                    value={payment.load_id}
                                    iconColor="bg-blue-50"
                                />
                                <InfoRow
                                    icon={Calendar}
                                    label="Shipment Date"
                                    value={formatDate(payment.shipment_date)}
                                    iconColor="bg-indigo-50"
                                />
                                <InfoRow
                                    icon={MapPin}
                                    label="Origin Location"
                                    value={payment.origin_location}
                                    iconColor="bg-emerald-50"
                                />
                                <InfoRow
                                    icon={MapPin}
                                    label="Destination Location"
                                    value={payment.destination_location}
                                    iconColor="bg-red-50"
                                />
                                <InfoRow
                                    icon={AlertTriangle}
                                    label="Overdue Date"
                                    value={payment.overdue_date ? formatDate(payment.overdue_date) : 'N/A'}
                                    iconColor="bg-red-50"
                                    valueColor={payment.overdue_date ? "text-red-600 font-bold" : "text-gray-400"}
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Documents Section */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-cyan-50/50 to-white flex items-center gap-3">
                                <div className="p-2 bg-cyan-100 rounded-xl">
                                    <FileText className="h-5 w-5 text-cyan-600" />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#0f172a]">Documents</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-5">
                                    {/* Bility Document */}
                                    <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center min-h-[220px] ${payment.builty_path ? 'border-emerald-200 bg-emerald-50/30 cursor-pointer hover:bg-emerald-50/60 hover:shadow-md transition-all' : 'border-gray-200 bg-gray-50/30'}`}>
                                        {payment.builty_path ? (
                                            <>
                                                <div className="p-4 bg-emerald-100 rounded-2xl mb-3">
                                                    <ImageIcon className="h-10 w-10 text-emerald-600" />
                                                </div>
                                                <p className="text-[14px] font-bold text-emerald-700">Bility</p>
                                                <p className="text-[11px] text-emerald-500 mt-1">Tap to view document</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-4 bg-gray-100 rounded-2xl mb-3">
                                                    <ImageIcon className="h-10 w-10 text-gray-300" />
                                                </div>
                                                <p className="text-[14px] font-bold text-gray-400">Bility</p>
                                                <p className="text-[11px] text-gray-300 mt-1">Not uploaded yet</p>
                                            </>
                                        )}
                                    </div>

                                    {/* POD Document */}
                                    <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center min-h-[220px] ${payment.pod_path ? 'border-emerald-200 bg-emerald-50/30 cursor-pointer hover:bg-emerald-50/60 hover:shadow-md transition-all' : 'border-gray-200 bg-gray-50/30'}`}>
                                        {payment.pod_path ? (
                                            <>
                                                <div className="p-4 bg-emerald-100 rounded-2xl mb-3">
                                                    <FileText className="h-10 w-10 text-emerald-600" />
                                                </div>
                                                <p className="text-[14px] font-bold text-emerald-700">POD</p>
                                                <p className="text-[11px] text-emerald-500 mt-1">Tap to view document</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-4 bg-gray-100 rounded-2xl mb-3">
                                                    <FileText className="h-10 w-10 text-gray-300" />
                                                </div>
                                                <p className="text-[14px] font-bold text-gray-400">POD</p>
                                                <p className="text-[11px] text-gray-300 mt-1">Not uploaded yet</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
