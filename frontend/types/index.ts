// ─────────────────────────────────────────────
//  HYPERFITNESS — Core Type Definitions
// ─────────────────────────────────────────────

// ── Auth Types ──────────────────────────────
export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active?: boolean;
  xp?: number;
  level?: number;
  rank?: string;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

// ── User Types ───────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  membership?: Membership;
  attendance_count?: number;
  workout_count?: number;
}

export interface UserProfile extends User {
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  height_cm?: number;
  weight_kg?: number;
  fitness_goal?: string;
  emergency_contact?: string;
}

// ── Membership Types ─────────────────────────
export type MembershipStatus = "active" | "expired" | "cancelled" | "pending";
export type PlanInterval = "monthly" | "quarterly" | "yearly";

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: PlanInterval;
  features: string[];
  is_active: boolean;
  color?: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string;
  status: MembershipStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;

  // Relations
  plan?: MembershipPlan;
  user?: User;
}

// ── Attendance Types ──────────────────────────
export interface Attendance {
  id: string;
  user_id: string;
  check_in: string;
  check_out?: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;

  // Relations
  user?: User;
}

export interface AttendanceStats {
  total_visits: number;
  this_week: number;
  this_month: number;
  avg_duration_minutes: number;
  current_streak: number;
  longest_streak: number;
}

// ── Workout Types ─────────────────────────────
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "cardio"
  | "full_body";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group: MuscleGroup;
  difficulty: DifficultyLevel;
  equipment?: string;
  video_url?: string;
  thumbnail_url?: string;
  calories_per_minute?: number;
  created_at: string;
}

export interface WorkoutExercise {
  exercise_id: string;
  exercise?: Exercise;
  sets: number;
  reps: number;
  weight_kg?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  difficulty: DifficultyLevel;
  estimated_duration_minutes: number;
  calories_burned?: number;
  exercises: WorkoutExercise[];
  assigned_to?: string; // user_id
  created_by: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  calories_burned?: number;
  notes?: string;
  rating?: number;
  created_at: string;

  // Relations
  workout?: Workout;
  user?: User;
}

// ── Payment Types ─────────────────────────────
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer";

export interface Payment {
  id: string;
  user_id: string;
  membership_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transaction_id?: string;
  notes?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;

  // Relations
  user?: User;
  membership?: Membership;
}

// ── Progress Types ────────────────────────────
export interface ProgressEntry {
  id: string;
  user_id: string;
  recorded_at: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  bmi?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  notes?: string;
  created_at: string;
}

// ── Analytics Types ───────────────────────────
export interface DashboardStats {
  total_members: number;
  active_members: number;
  new_members_this_month: number;
  total_revenue: number;
  revenue_this_month: number;
  revenue_growth: number;
  total_check_ins: number;
  check_ins_today: number;
  active_memberships: number;
  expiring_soon: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target?: number;
}

export interface AttendanceDataPoint {
  date: string;
  count: number;
  unique_members: number;
}

export interface MembershipDistribution {
  plan_name: string;
  count: number;
  percentage: number;
  color: string;
}

// ── Notification Types ────────────────────────
export type NotificationType =
  | "membership_expiry"
  | "payment_received"
  | "check_in"
  | "workout_reminder"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── API Response Types ────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// ── Filter & Sort Types ───────────────────────
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface UserFilters extends PaginationParams, SortParams {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  membership_status?: MembershipStatus;
}

export interface PaymentFilters extends PaginationParams, SortParams {
  search?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  user_id?: string;
}

export interface AttendanceFilters extends PaginationParams, SortParams {
  user_id?: string;
  date_from?: string;
  date_to?: string;
}
