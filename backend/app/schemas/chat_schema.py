from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversation_id: str
    question: str


class SourceResponse(BaseModel):
    filename: str
    chunk_number: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceResponse]