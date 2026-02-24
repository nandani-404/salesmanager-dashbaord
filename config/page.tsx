// export const BASE_URL = "https://devtruckmitr.in";
export const BASE_URL = "https://development.truckmitr.com";

export const API_ENDPOINTS = {
    dashboard: {
        shippers: "/api/dashboard/shippers",
        shippersFull: "/api/dashboard/shippers-full",
        shipperLoads: (shipperId: string | number) => `/api/dashboard/shipper/${shipperId}/loads`,
        shipperLoadDetail: (shipperId: string | number, loadId: string | number) => `/api/dashboard/shipper/${shipperId}/load/${loadId}`,
        shipperUpdateStatus: (shipperId: string | number) => `/api/dashboard/shipper/${shipperId}/update-status`,
        transporters: "/api/dashboard/transporters",
        truckerDetail: (id: string | number) => `/api/dashboard/trucker/${id}`,
        truckerUpdateStatus: (id: string | number) => `/api/dashboard/trucker/${id}/update-status`,
        shipmentsLoads: "/api/dashboard/shipments/loads",
        applicationUpdate: "/api/dashboard/application/update",
        dashboardSummary: "/api/dashboard/dashboard-summary",
        userSearch: (query: string) => `/dashboard/users/search?query=${encodeURIComponent(query)}`,
    },
    auth: {
        login: "/api/sales-login",
    },
};
