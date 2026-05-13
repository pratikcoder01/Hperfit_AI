import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import the Google GenAI embeddings model
try:
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
except ImportError:
    GoogleGenerativeAIEmbeddings = None

from app.models.memory_models import AIVectorMemory

logger = logging.getLogger(__name__)

class HyperCoachMemoryManager:
    """
    Handles Long-Term AI Memory extraction, embedding, and Contextual RAG retrieval.
    """
    def __init__(self, db: Session):
        self.db = db
        if GoogleGenerativeAIEmbeddings:
            try:
                # model text-embedding-004 is optimized for semantic retrieval
                self.embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
            except Exception as e:
                logger.error(f"Failed to initialize embeddings: {e}")
                self.embeddings = None
        else:
            self.embeddings = None

    def store_memory(self, user_id: str, content: str, category: str = "general", importance: int = 5) -> bool:
        """
        Converts a string fact into a vector and stores it in PostgreSQL via pgvector.
        """
        if not self.embeddings:
            logger.warning("Embeddings not initialized. Cannot store memory.")
            return False
            
        try:
            # 1. Generate Vector Embedding
            vector = self.embeddings.embed_query(content)
            
            # 2. Store in Database
            memory_record = AIVectorMemory(
                user_id=user_id,
                category=category,
                content=content,
                importance=importance,
                embedding=vector
            )
            self.db.add(memory_record)
            self.db.commit()
            logger.info(f"Memory stored for user {user_id}: '{content}'")
            return True
        except Exception as e:
            logger.error(f"Error storing memory: {e}")
            self.db.rollback()
            return False

    def retrieve_context(self, user_id: str, query: str, limit: int = 5) -> str:
        """
        Retrieves the most relevant facts from the user's past using Cosine Similarity.
        Results are weighted by their predefined 'importance' score.
        """
        if not self.embeddings:
            return "Memory system offline."

        try:
            # 1. Embed the user's current query
            query_vector = self.embeddings.embed_query(query)
            
            # Convert list to pgvector string format: '[0.1, 0.2, ...]'
            vector_str = f"[{','.join(map(str, query_vector))}]"
            
            # 2. Perform Cosine Distance search (`<=>` operator in pgvector)
            # We rank by: (1 - cosine_distance) * importance
            # This ensures highly important medical facts aren't drowned out by recent casual chat
            sql_query = text("""
                SELECT content, category, importance, 
                       (1 - (embedding <=> :vector)) as similarity
                FROM ai_vector_memories
                WHERE user_id = :user_id
                ORDER BY ((1 - (embedding <=> :vector)) * importance) DESC
                LIMIT :limit
            """)
            
            results = self.db.execute(sql_query, {
                "vector": vector_str,
                "user_id": user_id,
                "limit": limit
            }).fetchall()
            
            if not results:
                return "No historical context found."
                
            # 3. Format the retrieved facts for the LangGraph prompt
            formatted_memories = ["--- RECALLED FACTS ---"]
            for row in results:
                # row structure depends on sqlalchemy version, usually tuple/dict like access
                formatted_memories.append(f"[{row.category.upper()}] (Importance: {row.importance}/10): {row.content}")
                
            return "\n".join(formatted_memories)

        except Exception as e:
            logger.error(f"Error retrieving memory: {e}")
            return "Memory retrieval failed."
