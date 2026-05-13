import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjabeikczjydruzyshmu.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wT3_4V-9t1XedDboNhH0vg_C2WnsKPu';
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'member';
          xp: number;
          level: number;
          rank: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'member';
          xp?: number;
          level?: number;
          rank?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'member';
          xp?: number;
          level?: number;
          rank?: string;
          updated_at?: string;
        };
      };
      social_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_url: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          media_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          media_url?: string | null;
          likes_count?: number;
          comments_count?: number;
        };
      };
    };
  };
};
