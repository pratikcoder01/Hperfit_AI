// ─────────────────────────────────────────────
//  HYPERFITNESS — API Client (Axios)
// ─────────────────────────────────────────────

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiError } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Main API Client ──────────────────────────
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach access token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hf_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("hf_refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );

        localStorage.setItem("hf_access_token", data.access_token);
        localStorage.setItem("hf_refresh_token", data.refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }

        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem("hf_access_token");
        localStorage.removeItem("hf_refresh_token");
        localStorage.removeItem("hf_user");

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// ── Helper: extract error message ─────────────
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export default apiClient;
