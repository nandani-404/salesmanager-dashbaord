"use client";

import { useEffect } from "react";

export function SWRegisterer() {
    useEffect(() => {
        // Service Worker registration temporarily disabled to prevent stale cache issues during dev
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }, []);

    // This component doesn't render anything
    return null;
}
