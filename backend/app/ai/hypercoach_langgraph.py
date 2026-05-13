import os
import logging
from typing import TypedDict, Annotated, Sequence, Dict, Any, Literal
import operator

# Set up LangChain / LangGraph imports
try:
    from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langgraph.graph import StateGraph, END
    import langgraph
except ImportError:
    logging.warning("LangGraph / LangChain dependencies not found. Please pip install langgraph langchain langchain-google-genai")

logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# 1. DEFINE AGENT STATE
# ---------------------------------------------------------
class AgentState(TypedDict):
    """The state of the conversation and agent routing."""
    messages: Annotated[Sequence[BaseMessage], operator.add]
    user_context: Dict[str, Any]
    next_node: str

# ---------------------------------------------------------
# 2. SYSTEM PROMPTS & PERSONA
# ---------------------------------------------------------
MASTER_PERSONA = """You are HyperCoach, an elite, highly empathetic, and fiercely disciplined AI Personal Trainer.
You are not a generic AI. You act like a world-class human coach.
Speak directly to the user. Use an energetic, motivating tone.
If they miss workouts, be tough but supportive. If they succeed, hype them up.
Context provided about the user:
{context}
"""

SUPERVISOR_PROMPT = """You are the Supervisor Router for HyperCoach. 
Analyze the user's latest message and determine which specialist agent should handle it.
Respond with EXACTLY ONE of the following words and nothing else:
- WORKOUT (if they ask about exercise, form, gym, etc.)
- DIET (if they ask about food, calories, recipes, macros)
- MOTIVATION (if they feel tired, want to quit, or need a push)
- RECOVERY (if they mention sleep, HRV, soreness, or injuries)
- GENERAL (if it's a casual chat or doesn't fit the others)
"""

# ---------------------------------------------------------
# 3. BUILD THE GRAPH & NODES
# ---------------------------------------------------------
class HyperCoachGraph:
    def __init__(self):
        # We use Gemini 1.5 Pro for complex reasoning
        # Requires GEMINI_API_KEY environment variable
        try:
            self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.7)
            self.router_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.0) # Faster for routing
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
            self.llm = None
            self.router_llm = None

        self.graph = self._build_graph()

    def _format_context(self, state: AgentState) -> str:
        ctx = state.get("user_context", {})
        return f"Age: {ctx.get('age', 'Unknown')}, Goal: {ctx.get('goal', 'Unknown')}, " \
               f"Injuries: {ctx.get('injuries', 'None')}"

    # --- AGENT NODES ---

    def supervisor_node(self, state: AgentState) -> AgentState:
        """Determines which agent should handle the user's message."""
        if not self.router_llm:
            return {"next_node": "general_agent"}

        messages = [SystemMessage(content=SUPERVISOR_PROMPT)] + list(state["messages"])
        response = self.router_llm.invoke(messages)
        decision = response.content.strip().upper()
        
        valid_nodes = {"WORKOUT": "workout_agent", "DIET": "diet_agent", 
                       "MOTIVATION": "motivation_agent", "RECOVERY": "recovery_agent"}
        
        next_node = valid_nodes.get(decision, "general_agent")
        logger.info(f"[Supervisor] Routing to -> {next_node}")
        return {"next_node": next_node}

    def workout_agent(self, state: AgentState) -> AgentState:
        sys_msg = SystemMessage(content=MASTER_PERSONA.format(context=self._format_context(state)) + 
            "\nYou are the WORKOUT specialist. Focus on progressive overload, form, and exercise science. Generate precise sets and reps.")
        response = self.llm.invoke([sys_msg] + list(state["messages"]))
        return {"messages": [response]}

    def diet_agent(self, state: AgentState) -> AgentState:
        sys_msg = SystemMessage(content=MASTER_PERSONA.format(context=self._format_context(state)) + 
            "\nYou are the NUTRITION specialist. Focus on macros, healthy recipes, and metabolic optimization.")
        response = self.llm.invoke([sys_msg] + list(state["messages"]))
        return {"messages": [response]}

    def motivation_agent(self, state: AgentState) -> AgentState:
        sys_msg = SystemMessage(content=MASTER_PERSONA.format(context=self._format_context(state)) + 
            "\nYou are the MOTIVATION specialist. The user is struggling. Use behavioral psychology to fire them up. Be intense but deeply empathetic.")
        response = self.llm.invoke([sys_msg] + list(state["messages"]))
        return {"messages": [response]}

    def recovery_agent(self, state: AgentState) -> AgentState:
        sys_msg = SystemMessage(content=MASTER_PERSONA.format(context=self._format_context(state)) + 
            "\nYou are the RECOVERY specialist. Focus on sleep architecture, HRV, stretching, and injury prevention.")
        response = self.llm.invoke([sys_msg] + list(state["messages"]))
        return {"messages": [response]}

    def general_agent(self, state: AgentState) -> AgentState:
        sys_msg = SystemMessage(content=MASTER_PERSONA.format(context=self._format_context(state)))
        response = self.llm.invoke([sys_msg] + list(state["messages"]))
        return {"messages": [response]}

    # --- CONDITIONAL ROUTER ---
    def router(self, state: AgentState) -> str:
        return state.get("next_node", "general_agent")

    # --- GRAPH COMPILATION ---
    def _build_graph(self):
        try:
            workflow = StateGraph(AgentState)

            # Add nodes
            workflow.add_node("supervisor", self.supervisor_node)
            workflow.add_node("workout_agent", self.workout_agent)
            workflow.add_node("diet_agent", self.diet_agent)
            workflow.add_node("motivation_agent", self.motivation_agent)
            workflow.add_node("recovery_agent", self.recovery_agent)
            workflow.add_node("general_agent", self.general_agent)

            # Set entry point
            workflow.set_entry_point("supervisor")

            # Add conditional edges from supervisor
            workflow.add_conditional_edges(
                "supervisor",
                self.router,
                {
                    "workout_agent": "workout_agent",
                    "diet_agent": "diet_agent",
                    "motivation_agent": "motivation_agent",
                    "recovery_agent": "recovery_agent",
                    "general_agent": "general_agent"
                }
            )

            # All agents end the process after responding
            for node in ["workout_agent", "diet_agent", "motivation_agent", "recovery_agent", "general_agent"]:
                workflow.add_edge(node, END)

            # Compile
            return workflow.compile()
        except NameError:
            logger.warning("Graph not compiled because dependencies are missing.")
            return None

    # --- EXECUTION ENGINE ---
    def invoke(self, user_message: str, user_context: Dict[str, Any], message_history: List[Any] = None):
        """Invoke the LangGraph multi-agent system."""
        if not self.graph:
            return "AI Coach dependencies are not installed."

        if message_history is None:
            message_history = []
            
        messages = message_history + [HumanMessage(content=user_message)]
        initial_state = {"messages": messages, "user_context": user_context, "next_node": ""}
        
        # Run graph
        logger.info("Executing HyperCoach LangGraph Workflow...")
        result = self.graph.invoke(initial_state)
        
        # Extract the final AIMessage from the state
        final_message = result["messages"][-1].content
        return final_message

# Global Instance
hypercoach_app = HyperCoachGraph()
