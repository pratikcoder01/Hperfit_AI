# ─────────────────────────────────────────────
#  HyperFitness Phase 3 — ML & CV Models
# ─────────────────────────────────────────────
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database.session import Base
from app.models.models import TimestampMixin

class CVSession(Base, TimestampMixin):
    __tablename__ = "cv_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_type = Column(String(50), nullable=False)
    total_reps = Column(Integer, default=0)
    good_reps = Column(Integer, default=0)
    avg_form_score = Column(Float, default=0.0)
    injury_risk_detected = Column(String(50), nullable=True) # low, medium, high
    metrics_data = Column(JSON, nullable=True) # Stores detailed rep data and joint angles

class BodyTransformation(Base, TimestampMixin):
    __tablename__ = "body_transformations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    current_weight = Column(Float, nullable=False)
    target_weight = Column(Float, nullable=False)
    timeline_weeks = Column(Integer, nullable=False)
    success_probability = Column(Float, nullable=True)
    predicted_milestones = Column(JSON, nullable=True) # Array of predictions

class MLAnalytics(Base, TimestampMixin):
    __tablename__ = "ml_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    fatigue_level = Column(Float, nullable=True)
    adherence_score = Column(Float, nullable=True)
    predicted_churn = Column(Float, nullable=True)
    generated_insights = Column(JSON, nullable=True)
