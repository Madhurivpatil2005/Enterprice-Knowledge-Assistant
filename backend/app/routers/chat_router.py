from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.schemas.chat_schema import (
    ChatRequest,
    ChatResponse,
)
from app.services.chat_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/ask",
    response_model=ChatResponse,
)
def ask(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    result = ask_question(
        conversation_id=request.conversation_id,
        question=request.question,
        current_user=current_user,
    )

    return ChatResponse(
        answer=result["answer"],
        sources=result["sources"],
    )

