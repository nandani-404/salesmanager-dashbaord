import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "@/config/page";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove("token");
            Cookies.remove("user");
            // Optional: Redirect to login page
            // window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
