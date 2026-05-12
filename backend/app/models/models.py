import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Float,
    ForeignKey, Text, Enum, Numeric, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database.session import Base


# ── Enums ─────────────────────────────────────
class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"


class MembershipStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"
    pending = "pending"


class PlanInterval(str, enum.Enum):
    monthly = "monthly"
    quarterly = "quarterly"
    yearly = "yearly"


class DifficultyLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class MuscleGroup(str, enum.Enum):
    chest = "chest"
    back = "back"
    shoulders = "shoulders"
    arms = "arms"
    legs = "legs"
    core = "core"
    cardio = "cardio"
    full_body = "full_body"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


class PaymentMethod(str, enum.Enum):
    cash = "cash"
    card = "card"
    upi = "upi"
    bank_transfer = "bank_transfer"


# ── Mixins ────────────────────────────────────
class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class SoftDeleteMixin:
    deleted_at = Column(DateTime(timezone=True), nullable=True, index=True)

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None


# ── User Model ────────────────────────────────
class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user, index=True)
    avatar_url = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True, index=True)

    # Fitness profile
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String(10), nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    fitness_goal = Column(String(255), nullable=True)
    emergency_contact = Column(String(255), nullable=True)

    # Relations
    memberships = relationship("Membership", back_populates="user", lazy="dynamic")
    attendance_records = relationship("Attendance", back_populates="user", lazy="dynamic")
    workout_logs = relationship("WorkoutLog", back_populates="user", lazy="dynamic")
    payments = relationship("Payment", back_populates="user", lazy="dynamic")
    progress_entries = relationship("ProgressEntry", back_populates="user", lazy="dynamic")
    notifications = relationship("Notification", back_populates="user", lazy="dynamic")

    __table_args__ = (
        Index("ix_users_email_active", "email", "is_active"),
    )


# ── Membership Plan ───────────────────────────
class MembershipPlan(Base, TimestampMixin):
    __tablename__ = "membership_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    interval = Column(Enum(PlanInterval), nullable=False)
    features = Column(Text, nullable=True)  # JSON string
    is_active = Column(Boolean, nullable=False, default=True)
    color = Column(String(20), nullable=True)

    # Relations
    memberships = relationship("Membership", back_populates="plan", lazy="dynamic")


# ── Membership ────────────────────────────────
class Membership(Base, TimestampMixin):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("membership_plans.id"), nullable=False)
    status = Column(Enum(MembershipStatus), nullable=False, default=MembershipStatus.pending, index=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False, index=True)

    # Relations
    user = relationship("User", back_populates="memberships")
    plan = relationship("MembershipPlan", back_populates="memberships")
    payments = relationship("Payment", back_populates="membership", lazy="dynamic")

    __table_args__ = (
        Index("ix_memberships_user_status", "user_id", "status"),
        Index("ix_memberships_end_date_status", "end_date", "status"),
    )


# ── Attendance ────────────────────────────────
class Attendance(Base, TimestampMixin):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    check_in = Column(DateTime(timezone=True), nullable=False, index=True)
    check_out = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)

    # Relations
    user = relationship("User", back_populates="attendance_records")

    __table_args__ = (
        Index("ix_attendance_user_date", "user_id", "check_in"),
    )


# ── Exercise ──────────────────────────────────
class Exercise(Base, TimestampMixin):
    __tablename__ = "exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    muscle_group = Column(Enum(MuscleGroup), nullable=False, index=True)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    equipment = Column(String(255), nullable=True)
    video_url = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    calories_per_minute = Column(Float, nullable=True)


# ── Workout ───────────────────────────────────
class Workout(Base, TimestampMixin):
    __tablename__ = "workouts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    estimated_duration_minutes = Column(Integer, nullable=False)
    calories_burned = Column(Integer, nullable=True)
    exercises = Column(Text, nullable=True)  # JSON array
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_template = Column(Boolean, nullable=False, default=False)

    # Relations
    logs = relationship("WorkoutLog", back_populates="workout", lazy="dynamic")

    __table_args__ = (
        Index("ix_workouts_assigned_template", "assigned_to", "is_template"),
    )


# ── Workout Log ───────────────────────────────
class WorkoutLog(Base, TimestampMixin):
    __tablename__ = "workout_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    workout_id = Column(UUID(as_uuid=True), ForeignKey("workouts.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    calories_burned = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5

    # Relations
    user = relationship("User", back_populates="workout_logs")
    workout = relationship("Workout", back_populates="logs")

    __table_args__ = (
        Index("ix_workout_logs_user_date", "user_id", "started_at"),
    )


# ── Payment ───────────────────────────────────
class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    membership_id = Column(UUID(as_uuid=True), ForeignKey("memberships.id"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="INR")
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.pending, index=True)
    method = Column(Enum(PaymentMethod), nullable=False)
    transaction_id = Column(String(255), unique=True, nullable=True)
    notes = Column(Text, nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relations
    user = relationship("User", back_populates="payments")
    membership = relationship("Membership", back_populates="payments")

    __table_args__ = (
        Index("ix_payments_user_status", "user_id", "status"),
        Index("ix_payments_status_date", "status", "created_at"),
    )


# ── Progress Entry ────────────────────────────
class ProgressEntry(Base, TimestampMixin):
    __tablename__ = "progress_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False, index=True)
    weight_kg = Column(Float, nullable=True)
    body_fat_percentage = Column(Float, nullable=True)
    muscle_mass_kg = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    hips_cm = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

    # Relations
    user = relationship("User", back_populates="progress_entries")


# ── Notification ──────────────────────────────
class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False, index=True)

    # Relations
    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index("ix_notifications_user_read", "user_id", "is_read"),
    )
