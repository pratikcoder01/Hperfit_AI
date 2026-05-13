import os
import logging
from typing import TypedDict, Annotated, List, Dict, Any, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- State Definition ---
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], "The chat history"]
    user_context: Dict[str, Any]  # Biometrics, goals, digital twin state
    next_agent: str
    action_plan: List[str]

# --- Agent Models ---
# Assuming GEMINI_API_KEY is in environment or passed directly
# For Phase 6, we use Gemini 1.5 Pro for its massive context window and reasoning
def get_llm():
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        logger.warning("GEMINI_API_KEY not found. Using dummy LLM for testing.")
        # In a real environment, raise an error or handle it.
    return ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key)

llm = get_llm()

# --- Supervisor Agent ---
def supervisor_node(state: AgentState) -> AgentState:
    """The Supervisor decides which specialized agent should handle the current state."""
    messages = state.get("messages", [])
    user_context = state.get("user_context", {})
    
    sys_prompt = f"""You are the HyperFitness AGI Supervisor.
You route tasks to specialized agents to optimize the human user.
User Context: {user_context}

Available Agents:
- WorkoutAgent: For exercise programming, real-time form feedback, biomechanics.
- NutritionAgent: For macro/micro-nutrient planning, metabolic rate calculations.
- RecoveryAgent: For sleep analysis, HRV interpretation, burnout prevention.
- Finish: If the request is fully resolved.

Based on the recent messages, decide which agent should act next.
Respond ONLY with one of: WorkoutAgent, NutritionAgent, RecoveryAgent, Finish"""

    messages_for_llm = [SystemMessage(content=sys_prompt)] + messages[-3:]
    response = llm.invoke(messages_for_llm)
    
    # Simple parsing
    content = response.content.strip().replace('`', '')
    next_agent = content if content in ["WorkoutAgent", "NutritionAgent", "RecoveryAgent"] else "Finish"
    
    logger.info(f"[Supervisor] Routing to -> {next_agent}")
    return {"next_agent": next_agent}

# --- Specialized Agents ---
def workout_agent_node(state: AgentState) -> AgentState:
    sys_prompt = """You are the HyperFitness Workout AGI. 
Optimize the user's physical training plan based on their digital twin data.
Consider fatigue, CNS load, and hypertrophy curves."""
    
    messages = [SystemMessage(content=sys_prompt)] + state["messages"]
    response = llm.invoke(messages)
    
    state["messages"].append(AIMessage(content=f"[Workout AGI]: {response.content}"))
    return state

def nutrition_agent_node(state: AgentState) -> AgentState:
    sys_prompt = """You are the HyperFitness Nutrition AGI.
Calculate dynamic metabolic needs based on today's exertion and recovery state."""
    
    messages = [SystemMessage(content=sys_prompt)] + state["messages"]
    response = llm.invoke(messages)
    
    state["messages"].append(AIMessage(content=f"[Nutrition AGI]: {response.content}"))
    return state

def recovery_agent_node(state: AgentState) -> AgentState:
    sys_prompt = """You are the HyperFitness Recovery AGI.
Analyze burnout risk, HRV trends, and sleep architecture to prescribe rest protocols."""
    
    messages = [SystemMessage(content=sys_prompt)] + state["messages"]
    response = llm.invoke(messages)
    
    state["messages"].append(AIMessage(content=f"[Recovery AGI]: {response.content}"))
    return state

# --- Routing Function ---
def route_next(state: AgentState) -> Literal["WorkoutAgent", "NutritionAgent", "RecoveryAgent", "__end__"]:
    route = state.get("next_agent", "Finish")
    if route == "Finish":
        return END
    return route

# --- Graph Construction ---
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("Supervisor", supervisor_node)
workflow.add_node("WorkoutAgent", workout_agent_node)
workflow.add_node("NutritionAgent", nutrition_agent_node)
workflow.add_node("RecoveryAgent", recovery_agent_node)

# Add edges
workflow.set_entry_point("Supervisor")
workflow.add_conditional_edges(
    "Supervisor",
    route_next,
    {
        "WorkoutAgent": "WorkoutAgent",
        "NutritionAgent": "NutritionAgent",
        "RecoveryAgent": "RecoveryAgent",
        END: END
    }
)

# After an agent acts, they return to the supervisor for further evaluation
workflow.add_edge("WorkoutAgent", "Supervisor")
workflow.add_edge("NutritionAgent", "Supervisor")
workflow.add_edge("RecoveryAgent", "Supervisor")

# Compile graph
agi_system = workflow.compile()

def run_agi_loop(user_message: str, user_context: dict) -> str:
    """Entry point for the FastAPI endpoint to interact with the AGI."""
    initial_state = {
        "messages": [HumanMessage(content=user_message)],
        "user_context": user_context,
        "next_agent": "",
        "action_plan": []
    }
    
    # Run the graph
    # For a real system, we might stream this.
    config = {"recursion_limit": 10}
    final_state = agi_system.invoke(initial_state, config=config)
    
    # Extract the final response
    # The AGI agents will have appended AIMessages.
    responses = [m.content for m in final_state["messages"] if isinstance(m, AIMessage)]
    return "\n\n".join(responses) if responses else "AGI Evaluation Complete. No action required."
