from datetime import datetime
from pydantic import BaseModel


class ConversationResponse(BaseModel):
    conversation_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class RenameConversationRequest(BaseModel):
    title: str


class MessageResponse(BaseModel):
    role: str
    content: str
    sources: list = []
    created_at: datetime