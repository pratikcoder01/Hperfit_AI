"use client";

import { useEffect, useCallback } from "react";
import { useGamificationStore } from "@/store/gamificationStore";
import type { SocialNotification } from "@/types/social";

/**
 * HyperFitness Phase 4 — Social WebSocket Hook
 * Simulates real-time social interactions and gamification events.
 * In a production environment, this would connect to the FastAPI WebSocket.
 */
export function useSocialSocket() {
  const { addXP, unlockAchievement } = useGamificationStore();

  const handleIncomingNotification = useCallback((notif: SocialNotification) => {
    console.log("New Social Notification:", notif);
    
    // Auto-trigger XP for social interaction simulation
    if (notif.type === "like") {
      addXP(10, "Received a like");
    } else if (notif.type === "achievement") {
      unlockAchievement({
        id: notif.id,
        name: notif.message.split(":")[0],
        description: notif.message.split(":")[1] || "You earned a new badge!",
        icon: "🏆",
        xpReward: 500,
        isUnlocked: true,
      });
    }
  }, [addXP, unlockAchievement]);

  useEffect(() => {
    // Simulate real-time events for demonstration
    const timer = setTimeout(() => {
      handleIncomingNotification({
        id: "notif_1",
        type: "achievement",
        actor: { id: "system", name: "HyperFit AI", username: "@system", avatarUrl: "", followersCount: 0, followingCount: 0 },
        message: "Consistency King: You completed 7 days of workouts!",
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }, 15000); // Trigger achievement after 15s of browsing social

    const likeTimer = setTimeout(() => {
      handleIncomingNotification({
        id: "notif_2",
        type: "like",
        actor: { id: "u2", name: "Marcus Rodriguez", username: "@marcus_lifts", avatarUrl: "", followersCount: 0, followingCount: 0 },
        message: "liked your workout post",
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(likeTimer);
    };
  }, [handleIncomingNotification]);

  return { simulateEvent: handleIncomingNotification };
}
