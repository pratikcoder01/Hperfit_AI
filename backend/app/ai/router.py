from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

from app.ai.hypercoach_langgraph import hypercoach_app
from app.auth.dependencies import get_current_user
from app.models.models import User
from app.database.session import get_db

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
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Endpoint for communicating with the HyperCoach LangGraph Multi-Agent System.
    """
    try:
        from app.ai.memory_manager import HyperCoachMemoryManager
        manager = HyperCoachMemoryManager(db)
        
        # 1. Retrieve highly relevant long-term memories using pgvector RAG
        recalled_memories = manager.retrieve_context(user_id=current_user.id, query=payload.message)

        # 2. Build user context
        user_context = {
            "name": current_user.full_name,
            "goal": "Muscle Gain", # Would come from DB profile
            "injuries": "None",
            "age": 28,
            "long_term_memory": recalled_memories
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

class MemoryPayload(BaseModel):
    content: str
    category: str = "general"
    importance: int = 5

@router.post("/memory")
async def save_ai_memory(
    payload: MemoryPayload,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    from app.ai.memory_manager import HyperCoachMemoryManager
    manager = HyperCoachMemoryManager(db)
    success = manager.store_memory(
        user_id=current_user.id,
        content=payload.content,
        category=payload.category,
        importance=payload.importance
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to store memory vector")
    return {"status": "success", "message": "Memory stored securely"}

@router.get("/memory")
async def get_relevant_memory(
    query: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    from app.ai.memory_manager import HyperCoachMemoryManager
    manager = HyperCoachMemoryManager(db)
    context = manager.retrieve_context(user_id=current_user.id, query=query)
    return {"status": "success", "recalled_context": context}

