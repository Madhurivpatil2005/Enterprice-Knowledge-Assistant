from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.auth.dependencies import get_current_user

from app.schemas.conversation_schema import (
    ConversationResponse,
    MessageResponse,
    RenameConversationRequest,
)

from app.services.conversation_service import (
    create_new_conversation,
    get_user_conversations,
    rename_user_conversation,
    get_conversation_messages,
    delete_user_conversation,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


# --------------------------------------------------
# Create New Conversation
# --------------------------------------------------

@router.post(
    "/new",
    response_model=ConversationResponse,
)
def create(
    current_user: dict = Depends(get_current_user),
):
    return create_new_conversation(
        current_user
    )


# --------------------------------------------------
# List Conversations
# --------------------------------------------------

@router.get(
    "/",
    response_model=list[ConversationResponse],
)
def get_all(
    current_user: dict = Depends(get_current_user),
):
    return get_user_conversations(
        current_user
    )


# --------------------------------------------------
# Rename Conversation
# --------------------------------------------------

@router.put(
    "/{conversation_id}",
)
def rename(
    conversation_id: str,
    request: RenameConversationRequest,
    current_user: dict = Depends(get_current_user),
):

    result = rename_user_conversation(
        conversation_id=conversation_id,
        title=request.title,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
        )

    return result

# --------------------------------------------------
# Get Conversation Messages
# --------------------------------------------------

@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def messages(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
):

    result = get_conversation_messages(
        conversation_id,
        current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
        )

    return result

# --------------------------------------------------
# Delete Conversation
# --------------------------------------------------

@router.delete(
    "/{conversation_id}",
)
def delete(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
):

    result = delete_user_conversation(
        conversation_id=conversation_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
        )

    return result