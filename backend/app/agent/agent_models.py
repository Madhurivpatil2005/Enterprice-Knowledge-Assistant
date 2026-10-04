from typing import Any, Dict, Optional

from pydantic import BaseModel


class AgentCommandRequest(BaseModel):
    command: str
    current_page: Optional[str] = None


class AgentAction(BaseModel):
    type: str
    tool: Optional[str] = None
    parameters: Dict[str, Any] = {}
    requires_confirmation: bool = False


class AgentCommandResponse(BaseModel):
    message: str
    action: Optional[AgentAction] = None
    data: Optional[Any] = None