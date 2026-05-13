"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useSupabaseRealtime<T extends Record<string, any>>(
  table: string,
  filter?: { column: string; value: string }
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        // Initial fetch
        let query = supabase.from(table).select('*');
        
        if (filter) {
          query = query.eq(filter.column, filter.value);
        }

        const { data: initialData, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        if (initialData) setData(initialData as T[]);

        // Set up real-time subscription
        channel = supabase
          .channel(`${table}-changes`)
          .on(
            'postgres_changes' as any,
            {
              event: '*',
              schema: 'public',
              table: table,
              filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setData((prev) => [...prev, payload.new as T]);
              } else if (payload.eventType === 'UPDATE') {
                setData((prev) =>
                  prev.map((item) =>
                    item.id === payload.new.id ? payload.new as T : item
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setData((prev) =>
                  prev.filter((item) => item.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();

      } catch (err) {
        setError(err as Error);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter]);

  return { data, error };
}

// Hook for real-time user profile updates
export function useUserProfileRealtime(userId: string) {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        // Initial fetch
        const { data: initialData, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (fetchError) throw fetchError;
        if (initialData) setProfile(initialData);

        // Set up real-time subscription
        channel = supabase
          .channel(`profile-${userId}`)
          .on(
            'postgres_changes' as any,
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${userId}`,
            },
            (payload: any) => {
              if (payload.eventType === 'UPDATE') {
                setProfile(payload.new);
              }
            }
          )
          .subscribe();

      } catch (err) {
        setError(err as Error);
      }
    };

    if (userId) {
      setupSubscription();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return { profile, error };
}

// Hook for real-time social feed
export function useSocialFeedRealtime() {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        // Initial fetch
        const { data: initialData, error: fetchError } = await supabase
          .from('social_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (fetchError) throw fetchError;
        if (initialData) setPosts(initialData);

        // Set up real-time subscription
        channel = supabase
          .channel('social-feed')
          .on(
            'postgres_changes' as any,
            {
              event: '*',
              schema: 'public',
              table: 'social_posts',
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setPosts((prev) => [payload.new, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setPosts((prev) =>
                  prev.map((post) =>
                    post.id === payload.new.id ? payload.new : post
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setPosts((prev) =>
                  prev.filter((post) => post.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();

      } catch (err) {
        setError(err as Error);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { posts, error };
}
