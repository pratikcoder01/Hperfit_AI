"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, AuthTokens, LoginCredentials, RegisterPayload } from "@/types";
import apiClient from "@/lib/api-client";

// ── Demo Users (no backend needed) ────────────
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@hyperfitness.io": {
    password: "admin123",
    id: "demo-admin-001",
    email: "admin@hyperfitness.io",
    full_name: "Alex Admin",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "user@hyperfitness.io": {
    password: "user123",
    id: "demo-user-001",
    email: "user@hyperfitness.io",
    full_name: "Sam Member",
    role: "user",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

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

        // ── Demo Mode bypass ──────────────────────────────
        const demoEntry = DEMO_USERS[credentials.email];
        if (demoEntry && demoEntry.password === credentials.password) {
          await new Promise((r) => setTimeout(r, 700)); // Simulate network
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pw, ...user } = demoEntry;
          set({
            user,
            accessToken: "demo-access-token",
            refreshToken: "demo-refresh-token",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
        // ─────────────────────────────────────────────────

        try {
          // FastAPI OAuth2 expects form data
          const formData = new URLSearchParams();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);

          const { data: tokens } = await apiClient.post<AuthTokens>(
            "/auth/login",
            formData,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );

          localStorage.setItem("hf_access_token", tokens.access_token);
          localStorage.setItem("hf_refresh_token", tokens.refresh_token);

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
        if (!refreshToken || refreshToken === "demo-refresh-token") return;

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
