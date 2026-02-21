"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/lib/api/auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/lib/redux/slices/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState<{ mobile?: string; password?: string, general?: string }>({});

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    function validate() {
        const next: typeof localErrors = {};
        if (!mobile.trim()) {
            next.mobile = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
            next.mobile = "Enter a valid 10-digit Indian mobile number";
        }

        // Password validation relaxed based on user requirement (password is mobile number)
        if (!password) {
            next.password = "Password is required";
        }

        setLocalErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalErrors({});

        if (!validate()) return;

        try {
            dispatch(loginStart());

            const response = await authApi.login({ mobile, password });

            if (response.status && response.token) {
                dispatch(loginSuccess({
                    user: response.data,
                    token: response.token
                }));
                router.push("/dashboard");
            } else {
                const errorMsg = response.message || "Login failed. Please try again.";
                dispatch(loginFailure(errorMsg));
                setLocalErrors(prev => ({ ...prev, general: errorMsg }));
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "An unexpected error occurred.";
            dispatch(loginFailure(errorMsg));
            setLocalErrors(prev => ({ ...prev, general: errorMsg }));
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f9fafb 100%)",
                padding: "24px",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            {/* Decorative blobs */}
            <div
                style={{
                    position: "fixed",
                    top: "-120px",
                    right: "-120px",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "fixed",
                    bottom: "-100px",
                    left: "-100px",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Card */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "20px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px -12px rgba(59,130,246,0.12)",
                        padding: "44px 36px 40px",
                        border: "1px solid rgba(229,231,235,0.6)",
                    }}
                >
                    {/* Logo & Heading */}
                    <div style={{ textAlign: "center", marginBottom: "36px" }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            style={{
                                margin: "0 auto 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* TruckMitr Logo */}
                            <img
                                src="/icons/logotrick.png"
                                alt="TruckMitr Logo"
                                style={{
                                    height: "80px",
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </motion.div>

                        <h1
                            style={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#111827",
                                margin: "0 0 6px",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#6B7280",
                                margin: 0,
                                lineHeight: 1.5,
                            }}
                        >
                            Sign in to your Sales Manager account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Global Error Message */}
                        <AnimatePresence>
                            {localErrors.general && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{
                                        padding: "12px",
                                        borderRadius: "8px",
                                        backgroundColor: "#FEF2F2",
                                        border: "1px solid #FECACA",
                                        color: "#B91C1C",
                                        fontSize: "13px",
                                        textAlign: "center",
                                    }}
                                >
                                    {localErrors.general}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mobile Number */}
                        <div>
                            <label
                                htmlFor="mobile"
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}
                            >
                                Mobile Number
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: localErrors.mobile ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                                    borderRadius: "12px",
                                    background: "#F9FAFB",
                                    transition: "all 0.2s",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Country Code Prefix */}
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "0 0 0 14px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#374151",
                                        userSelect: "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    🇮🇳 +91
                                </span>
                                <input
                                    id="mobile"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="Enter mobile number"
                                    value={mobile}
                                    onChange={(e) => {
                                        setMobile(e.target.value.replace(/\D/g, ""));
                                        if (localErrors.mobile) setLocalErrors((p) => ({ ...p, mobile: undefined }));
                                        // Auto-fill password with mobile number as per requirement
                                        if (e.target.value.replace(/\D/g, "").length <= 10) {
                                            // Optional: if you want to sync them strictly
                                            // setPassword(e.target.value.replace(/\D/g, ""));
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: "14px 14px 14px 10px",
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        fontSize: "15px",
                                        color: "#111827",
                                        letterSpacing: "0.04em",
                                    }}
                                />
                            </div>
                            {localErrors.mobile && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: "12px", color: "#EF4444", marginTop: "6px" }}
                                >
                                    {localErrors.mobile}
                                </motion.p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}
                            >
                                Password
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: localErrors.password ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                                    borderRadius: "12px",
                                    background: "#F9FAFB",
                                    transition: "all 0.2s",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Lock icon */}
                                <span style={{ padding: "0 0 0 14px", display: "flex", alignItems: "center" }}>
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#9CA3AF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (localErrors.password) setLocalErrors((p) => ({ ...p, password: undefined }));
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: "14px 8px 14px 10px",
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        fontSize: "15px",
                                        color: "#111827",
                                    }}
                                />
                                {/* Toggle visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "0 14px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {localErrors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: "12px", color: "#EF4444", marginTop: "6px" }}
                                >
                                    {localErrors.password}
                                </motion.p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "#3B82F6",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: "100%",
                                padding: "15px",
                                border: "none",
                                borderRadius: "12px",
                                background: loading
                                    ? "linear-gradient(135deg, #93C5FD, #7DD3FC)"
                                    : "linear-gradient(135deg, #3B82F6, #06B6D4)",
                                color: "#FFFFFF",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: "0 4px 14px -3px rgba(59,130,246,0.4)",
                                transition: "all 0.2s",
                                letterSpacing: "0.01em",
                            }}
                        >
                            {loading && (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                    style={{ display: "inline-flex" }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                </motion.span>
                            )}
                            {loading ? "Signing In..." : "Sign In"}
                        </motion.button>
                    </form>
                </div>

                {/* Footer */}
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#9CA3AF",
                        marginTop: "28px",
                    }}
                >
                    Powered by{" "}
                    <span style={{ fontWeight: 600, color: "#6B7280" }}>TruckMitr</span>
                </p>
            </motion.div>
        </div>
    );
}
