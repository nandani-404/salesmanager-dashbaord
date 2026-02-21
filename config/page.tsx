export const BASE_URL = "https://devtruckmitr.in";

export const API_ENDPOINTS = {
    dashboard: {
        shippers: "/api/dashboard/shippers",
        shippersFull: "/api/dashboard/shippers-full",
        shipperLoads: (shipperId: string | number) => `/api/dashboard/shipper/${shipperId}/loads`,
        shipperLoadDetail: (shipperId: string | number, loadId: string | number) => `/api/dashboard/shipper/${shipperId}/load/${loadId}`,
        shipperUpdateStatus: (shipperId: string | number) => `/api/dashboard/shipper/${shipperId}/update-status`,
        transporters: "/api/dashboard/transporters",
        truckerDetail: (id: string | number) => `/api/dashboard/trucker/${id}`,
        shipmentsLoads: "/api/dashboard/shipments/loads",
    },
    auth: {
        login: "/api/sales-login",
    },
};
