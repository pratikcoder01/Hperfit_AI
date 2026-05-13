# ─────────────────────────────────────────────
#  HyperFitness Phase 5 — Enterprise & AI Models
# ─────────────────────────────────────────────
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, JSON, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.database.session import Base
from app.models.models import TimestampMixin

# ── 1. Multi-Tenant SaaS ──────────────────────
class GymTenant(Base, TimestampMixin):
    __tablename__ = "gym_tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False) # gym-name.hyperfitness.io
    branding_config = Column(JSON, nullable=True) # Colors, logos
    subscription_tier = Column(String(50), default="starter")
    is_active = Column(Boolean, default=True)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

class TenantSubscription(Base, TimestampMixin):
    __tablename__ = "tenant_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("gym_tenants.id"), nullable=False)
    plan_name = Column(String(100), nullable=False)
    status = Column(String(50), default="active")
    billing_period = Column(String(20), default="monthly")
    next_billing_date = Column(DateTime, nullable=True)

# ── 2. AI Memory & Behavior ───────────────────
class AIMemory(Base, TimestampMixin):
    __tablename__ = "ai_memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    behavioral_profile = Column(JSON, nullable=True) # Habits, preferences
    long_term_memory = Column(Text, nullable=True) # Summarized interactions
    interaction_vectors = Column(JSON, nullable=True) # For similarity search

class AutonomousCoachAction(Base, TimestampMixin):
    __tablename__ = "ai_coach_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action_type = Column(String(100), nullable=False) # "adjust_plan", "recovery_warning", "motivation"
    reasoning = Column(Text, nullable=True)
    data_payload = Column(JSON, nullable=True)

# ── 3. Health & Wearables ─────────────────────
class WearableIntegration(Base, TimestampMixin):
    __tablename__ = "wearable_integrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_type = Column(String(50), nullable=False) # Apple, Garmin, Oura
    access_token = Column(String(255), nullable=True)
    last_sync = Column(DateTime, nullable=True)

class HealthScore(Base, TimestampMixin):
    __tablename__ = "health_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    recovery_score = Column(Integer, default=0) # 0-100
    sleep_quality = Column(Integer, default=0)
    stress_level = Column(Integer, default=0)
    hrv_avg = Column(Float, nullable=True)
    recorded_date = Column(DateTime, default=datetime.utcnow)

# ── 4. Transformation Twin ───────────────────
class TransformationTwin(Base, TimestampMixin):
    __tablename__ = "transformation_twins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    physique_projection = Column(JSON, nullable=True) # 3D mesh parameters or visual markers
    performance_prediction = Column(JSON, nullable=True)
    confidence_score = Column(Float, default=0.0)
