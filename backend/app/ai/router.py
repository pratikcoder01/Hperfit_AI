from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

from app.ai.hypercoach_langgraph import hypercoach_app
from app.auth.dependencies import get_current_user
from app.models.models import User

router = APIRouter(prefix="/ai", tags=["AI Coach"])
logger = logging.getLogger(__name__)

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    reply: str
    status: str

@router.post("/chat", response_model=ChatResponse)
async def ai_coach_chat(
    payload: ChatMessage,
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for communicating with the HyperCoach LangGraph Multi-Agent System.
    """
    try:
        # Build user context
        user_context = {
            "name": current_user.full_name,
            "goal": "Muscle Gain", # Would come from DB
            "injuries": "None",
            "age": 28
        }
        
        # Merge incoming context (e.g. from wearables/frontend)
        if payload.context:
            user_context.update(payload.context)

        # Execute LangGraph Workflow
        reply = hypercoach_app.invoke(
            user_message=payload.message,
            user_context=user_context,
            message_history=payload.history
        )

        return ChatResponse(reply=reply, status="success")

    except Exception as e:
        logger.error(f"LangGraph Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
