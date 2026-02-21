import apiClient from "./client";
import { API_ENDPOINTS } from "@/config/page";

export interface LoginRequest {
    mobile: string;
    password?: string;
}

export interface LoginResponse {
    status: boolean;
    message: string;
    token: string;
    data: {
        id: number;
        name: string;
        role: string;
        mobile: string;
    };
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        // Use provided password or fallback to mobile if not provided (legacy/testing behavior)
        const password = credentials.password || credentials.mobile;

        const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, {
            mobile: credentials.mobile,
            password: password,
        });
        return response.data;
    },
    logout: async () => {
        // Implement logout logic if backend supports it, otherwise just client clean up
        return Promise.resolve();
    },
};
