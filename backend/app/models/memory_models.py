from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.session import Base

try:
    from pgvector.sqlalchemy import Vector
except ImportError:
    # Fallback for environments without pgvector installed during schema parsing
    Vector = String

class AIVectorMemory(Base):
    """
    Long-Term AI Memory Storage using pgvector.
    Stores extracted facts, physiological constraints, and psychological traits.
    """
    __tablename__ = "ai_vector_memories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    category = Column(String(50), nullable=False) # e.g., 'medical', 'diet', 'psychology', 'workout'
    content = Column(Text, nullable=False)        # The actual fact e.g., "User tore their left ACL in 2021"
    importance = Column(Integer, default=5)       # 1-10 scale. Medical=10, Diet preference=6
    
    # We use 768 dimensions for Google text-embedding-004 models
    embedding = Column(Vector(768))               
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship back to the User model
    user = relationship("User", backref="vector_memories")
