"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, LoginCredentials, RegisterPayload } from "@/types";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
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
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            
            if (supabaseUser) {
              // Fetch user profile from profiles table
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

              const authUser: AuthUser = {
                id: supabaseUser.id,
                email: supabaseUser.email!,
                full_name: (profile as any)?.full_name || supabaseUser.user_metadata?.full_name || '',
                avatar_url: (profile as any)?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
                role: (profile as any)?.role || 'member',
                xp: (profile as any)?.xp || 0,
                level: (profile as any)?.level || 1,
                rank: (profile as any)?.rank || 'Bronze',
                created_at: (profile as any)?.created_at || new Date().toISOString(),
              };

              set({
                user: authUser,
                accessToken: session.access_token,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // --- DEMO CREDENTIALS BYPASS ---
          if (credentials.email === "admin@hyperfitness.io" && credentials.password === "admin123") {
            set({
              user: {
                id: "demo-admin",
                email: "admin@hyperfitness.io",
                full_name: "Admin User",
                avatar_url: null,
                role: "admin",
                xp: 9999,
                level: 100,
                rank: "Grandmaster",
                created_at: new Date().toISOString(),
              },
              accessToken: "demo-admin-token",
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
          
          if (credentials.email === "user@hyperfitness.io" && credentials.password === "user123") {
            set({
              user: {
                id: "demo-user",
                email: "user@hyperfitness.io",
                full_name: "Demo Member",
                avatar_url: null,
                role: "member",
                xp: 120,
                level: 3,
                rank: "Bronze",
                created_at: new Date().toISOString(),
              },
              accessToken: "demo-user-token",
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
          // --- END DEMO BYPASS ---

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch user profile from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const authUser: AuthUser = {
              id: data.user.id,
              email: data.user.email!,
              full_name: (profile as any)?.full_name || data.user.user_metadata?.full_name || '',
              avatar_url: (profile as any)?.avatar_url || data.user.user_metadata?.avatar_url || null,
              role: (profile as any)?.role || 'member',
              xp: (profile as any)?.xp || 0,
              level: (profile as any)?.level || 1,
              rank: (profile as any)?.rank || 'Bronze',
              created_at: (profile as any)?.created_at || new Date().toISOString(),
            };

            set({
              user: authUser,
              accessToken: data.session.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: unknown) {
          const message = (error as { message?: string })?.message || "Login failed. Please check your credentials.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
              data: {
                full_name: payload.full_name,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Create profile in profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                full_name: payload.full_name,
                role: 'member',
                xp: 0,
                level: 1,
                rank: 'Bronze',
              } as any);

            if (profileError) throw profileError;

            set({ isLoading: false });
          }
        } catch (error: unknown) {
          const message = (error as { message?: string })?.message || "Registration failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshAuth: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) throw error;

          if (data.session) {
            set({
              accessToken: data.session.access_token,
            });
          }
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
