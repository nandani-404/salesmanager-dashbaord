"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

export function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={isCollapsed}
                setCollapsed={setIsCollapsed}
            />
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:pl-20" : "md:pl-72"
                )}
            >
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-4 md:p-6">{children}</main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
