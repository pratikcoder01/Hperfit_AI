import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import json

from app.models.enterprise import AIMemory, HealthScore, AutonomousCoachAction
from app.models.models import User, WorkoutLog
from app.lib.gemini import callGeminiJSON

logger = logging.getLogger("ai_coach")

class AutonomousCoachService:
    def __init__(self, db: Session, user_id: str):
        self.db = db
        self.user_id = user_id

    async def run_daily_analysis(self) -> Optional[AutonomousCoachAction]:
        """
        Main autonomous loop:
        1. Fetch health data (sleep, recovery, stress)
        2. Fetch recent workout performance
        3. Analyze with AI
        4. Trigger actions (warnings, motivation, plan adjustments)
        """
        # Fetch data context
        user = self.db.query(User).filter(User.id == self.user_id).first()
        health = self.db.query(HealthScore).filter(
            HealthScore.user_id == self.user_id
        ).order_by(HealthScore.recorded_date.desc()).first()
        
        recent_logs = self.db.query(WorkoutLog).filter(
            WorkoutLog.user_id == self.user_id
        ).order_by(WorkoutLog.started_at.desc()).limit(5).all()

        if not health or not user:
            return None

        # Build AI Prompt for Autonomous Analysis
        prompt = f"""
        ACT AS: HyperFitness Autonomous AI Coach.
        USER: {user.full_name}
        HEALTH STATS: Recovery {health.recovery_score}/100, Stress {health.stress_level}/100, Sleep {health.sleep_quality}/100.
        RECENT PERFORMANCE: {[f"{l.started_at}: {l.duration_minutes}min" for l in recent_logs]}

        TASK: Analyze if the user is overtraining, needs more intensity, or requires a recovery day.
        OUTPUT: JSON format with 'action_type' (adjust_plan, recovery_warning, motivation), 'reasoning', and 'data_payload'.
        """

        try:
            analysis = await callGeminiJSON(prompt)
            
            # Save the autonomous action
            action = AutonomousCoachAction(
                user_id=self.user_id,
                action_type=analysis.get("action_type", "motivation"),
                reasoning=analysis.get("reasoning", "Regular check-in"),
                data_payload=analysis.get("data_payload", {})
            )
            self.db.add(action)
            self.db.commit()
            
            logger.info(f"Autonomous Coach Action triggered for {user.full_name}: {action.action_type}")
            return action
        except Exception as e:
            logger.error(f"Autonomous analysis failed: {e}")
            return None

    async def get_ai_memory_context(self) -> Dict[str, Any]:
        """Retrieve user's persistent AI behavioral profile"""
        memory = self.db.query(AIMemory).filter(AIMemory.user_id == self.user_id).first()
        if not memory:
            return {}
        return memory.behavioral_profile or {}

    async def update_ai_memory(self, new_insights: Dict[str, Any]):
        """Update persistent behavioral profile based on new interactions"""
        memory = self.db.query(AIMemory).filter(AIMemory.user_id == self.user_id).first()
        if not memory:
            memory = AIMemory(user_id=self.user_id, behavioral_profile=new_insights)
            self.db.add(memory)
        else:
            current = memory.behavioral_profile or {}
            current.update(new_insights)
            memory.behavioral_profile = current
        self.db.commit()
