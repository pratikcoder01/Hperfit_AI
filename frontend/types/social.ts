// ─────────────────────────────────────────────
//  HyperFitness Phase 4 — Social & Feed Types
// ─────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  username: string;
  isVerified?: boolean;
  level?: number;
  rank?: string;
  followersCount: number;
  followingCount: number;
}

export type PostMediaType = "image" | "video" | "workout_share" | "achievement";

export interface SocialPost {
  id: string;
  author: UserProfile;
  content: string;
  mediaUrl?: string;
  mediaType?: PostMediaType;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  createdAt: string;
  workoutData?: {
    exercise: string;
    reps: number;
    duration: string;
    formScore: number;
  };
}

export interface Comment {
  id: string;
  author: UserProfile;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface SocialNotification {
  id: string;
  type: "like" | "comment" | "follow" | "challenge_invite" | "achievement";
  actor: UserProfile;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface TrainerProfile extends UserProfile {
  bio: string;
  specialties: string[];
  rating: number;
  clientCount: number;
  availableSlots: number;
  plans: TrainerPlan[];
}

export interface TrainerPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  durationWeeks: number;
}
