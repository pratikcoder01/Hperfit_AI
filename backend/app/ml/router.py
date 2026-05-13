from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import Any, Dict, List
import asyncio
import json

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User
from app.models.ml_models import CVSession, BodyTransformation

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

# ── 1. Telemetry Sync Endpoint ─────────────────
@router.post("/sync-session")
async def sync_cv_session(
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Sync a completed Computer Vision workout session from the browser to the backend.
    """
    try:
        session = CVSession(
            user_id=current_user.id,
            exercise_type=data.get("exercise", "unknown"),
            total_reps=data.get("total_reps", 0),
            good_reps=data.get("good_reps", 0),
            avg_form_score=data.get("avg_form_score", 0.0),
            injury_risk_detected=data.get("injury_risk", "low"),
            metrics_data=data.get("metrics", {})
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return {"success": True, "session_id": str(session.id)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ── 2. Real-time ML WebSocket ──────────────────
# Can be used to stream server-side ML model inferences back to the client if needed.
@router.websocket("/ws/inference")
async def ml_inference_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive client telemetry
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Example response logic
            response = {
                "event": "server_ack",
                "processed_score": 95,
                "latency_ms": 12
            }
            await websocket.send_json(response)
    except WebSocketDisconnect:
        pass

# ── 3. Transformation Simulation Save ──────────
@router.post("/transformations")
async def save_transformation(
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save an AI body transformation projection"""
    try:
        transform = BodyTransformation(
            user_id=current_user.id,
            current_weight=data.get("currentWeight"),
            target_weight=data.get("targetWeight"),
            timeline_weeks=data.get("timelineWeeks"),
            success_probability=data.get("successProbability"),
            predicted_milestones=data.get("milestones")
        )
        db.add(transform)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
