from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
import enum


# ── Shared ────────────────────────────────────
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    per_page: int
    total_pages: int


# ── Auth Schemas ──────────────────────────────
class LoginRequest(BaseModel):
    username: str  # Email (OAuth2 compatible)
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=255)
    phone: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# ── User Schemas ──────────────────────────────
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)
    role: str = "user"


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_goal: Optional[str] = None
    emergency_contact: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    phone: Optional[str]
    role: str
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserMeResponse(UserResponse):
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    fitness_goal: Optional[str]


# ── Membership Plan Schemas ───────────────────
class MembershipPlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    interval: str
    features: Optional[List[str]] = None
    color: Optional[str] = None


class MembershipPlanResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: float
    interval: str
    features: Optional[str]
    is_active: bool
    color: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Membership Schemas ────────────────────────
class MembershipCreate(BaseModel):
    user_id: UUID
    plan_id: UUID
    start_date: datetime
    end_date: datetime


class MembershipUpdate(BaseModel):
    status: Optional[str] = None
    end_date: Optional[datetime] = None


class MembershipResponse(BaseModel):
    id: UUID
    user_id: UUID
    plan_id: UUID
    status: str
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
    plan: Optional[MembershipPlanResponse] = None

    class Config:
        from_attributes = True


# ── Attendance Schemas ────────────────────────
class AttendanceCreate(BaseModel):
    user_id: Optional[UUID] = None  # Admin can specify; user uses their own ID
    notes: Optional[str] = None


class AttendanceCheckout(BaseModel):
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: UUID
    user_id: UUID
    check_in: datetime
    check_out: Optional[datetime]
    duration_minutes: Optional[int]
    notes: Optional[str]
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ── Workout Schemas ───────────────────────────
class WorkoutCreate(BaseModel):
    name: str
    description: Optional[str] = None
    difficulty: str
    estimated_duration_minutes: int = Field(gt=0)
    calories_burned: Optional[int] = None
    exercises: Optional[str] = None  # JSON
    assigned_to: Optional[UUID] = None
    is_template: bool = False


class WorkoutResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    difficulty: str
    estimated_duration_minutes: int
    calories_burned: Optional[int]
    exercises: Optional[str]
    assigned_to: Optional[UUID]
    created_by: UUID
    is_template: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Payment Schemas ───────────────────────────
class PaymentCreate(BaseModel):
    user_id: UUID
    membership_id: Optional[UUID] = None
    amount: float = Field(gt=0)
    method: str
    transaction_id: Optional[str] = None
    notes: Optional[str] = None


class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    transaction_id: Optional[str] = None
    paid_at: Optional[datetime] = None


class PaymentResponse(BaseModel):
    id: UUID
    user_id: UUID
    membership_id: Optional[UUID]
    amount: float
    currency: str
    status: str
    method: str
    transaction_id: Optional[str]
    notes: Optional[str]
    paid_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ── Progress Schemas ──────────────────────────
class ProgressCreate(BaseModel):
    recorded_at: datetime
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    muscle_mass_kg: Optional[float] = None
    bmi: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    notes: Optional[str] = None


class ProgressResponse(BaseModel):
    id: UUID
    user_id: UUID
    recorded_at: datetime
    weight_kg: Optional[float]
    body_fat_percentage: Optional[float]
    muscle_mass_kg: Optional[float]
    bmi: Optional[float]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Analytics Schemas ─────────────────────────
class DashboardStats(BaseModel):
    total_members: int
    active_members: int
    new_members_this_month: int
    total_revenue: float
    revenue_this_month: float
    revenue_growth: float
    total_check_ins: int
    check_ins_today: int
    active_memberships: int
    expiring_soon: int
