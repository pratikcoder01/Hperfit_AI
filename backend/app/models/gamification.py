# ─────────────────────────────────────────────
#  HyperFitness Phase 4 — Gamification Models
# ─────────────────────────────────────────────
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.database.session import Base
from app.models.models import TimestampMixin

class UserXP(Base, TimestampMixin):
    __tablename__ = "user_xp"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    total_xp = Column(Integer, default=0, index=True)
    level = Column(Integer, default=1, index=True)
    rank_name = Column(String(50), default="Beginner")
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)

class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon_url = Column(String(255), nullable=True)
    xp_reward = Column(Integer, default=100)
    requirement_type = Column(String(50), nullable=False) # e.g., "workout_count", "streak_days"
    requirement_value = Column(Integer, nullable=False)

class UserAchievement(Base, TimestampMixin):
    __tablename__ = "user_achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(UUID(as_uuid=True), ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        Index("ix_user_achievements_user_achievement", "user_id", "achievement_id", unique=True),
    )

class Challenge(Base, TimestampMixin):
    __tablename__ = "challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    challenge_type = Column(String(50), nullable=False) # "global", "community", "private"
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    goal_type = Column(String(50), nullable=False) # "reps", "workouts", "distance"
    goal_value = Column(Integer, nullable=False)
    reward_xp = Column(Integer, default=500)

class ChallengeParticipant(Base, TimestampMixin):
    __tablename__ = "challenge_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    current_progress = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)

    __table_args__ = (
        Index("ix_challenge_participants_challenge_user", "challenge_id", "user_id", unique=True),
    )
