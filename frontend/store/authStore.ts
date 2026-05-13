"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, AuthTokens, LoginCredentials, RegisterPayload } from "@/types";
import apiClient from "@/lib/api-client";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // FastAPI OAuth2 expects form data for /auth/login
          const formData = new URLSearchParams();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);

          const { data: tokens } = await apiClient.post<AuthTokens>(
            "/auth/login",
            formData,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );

          // Store tokens
          localStorage.setItem("hf_access_token", tokens.access_token);
          localStorage.setItem("hf_refresh_token", tokens.refresh_token);

          // Fetch user profile
          const { data: user } = await apiClient.get<AuthUser>("/auth/me", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          });

          set({
            user,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail || "Login failed. Please check your credentials.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post("/auth/register", payload);
          set({ isLoading: false });
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail || "Registration failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("hf_access_token");
        localStorage.removeItem("hf_refresh_token");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const { data } = await apiClient.post<AuthTokens>("/auth/refresh", {
            refresh_token: refreshToken,
          });

          localStorage.setItem("hf_access_token", data.access_token);
          localStorage.setItem("hf_refresh_token", data.refresh_token);

          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });
        } catch {
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "hf-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
