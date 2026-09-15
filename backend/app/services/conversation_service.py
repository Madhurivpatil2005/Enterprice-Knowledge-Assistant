from app.models.conversation_model import create_conversation

from app.services.message_service import (
    get_chat_history,
)

from app.repositories.conversation_repository import (
    create_conversation as save_conversation,
    find_conversations_by_user,
    find_conversation_by_id,
    rename_conversation,
    delete_conversation,
)


# ==================================================
# Create New Conversation
# ==================================================

def create_new_conversation(
    current_user: dict,
):

    conversation = create_conversation(
        title="New Chat",
        user_email=current_user["email"],
    )

    conversation_id = save_conversation(
        conversation
    )

    return {
        "conversation_id": str(
            conversation_id
        ),
        "title": conversation["title"],
        "created_at": conversation["created_at"],
        "updated_at": conversation["updated_at"],
    }


# ==================================================
# Get All Conversations
# ==================================================

def get_user_conversations(
    current_user: dict,
):

    conversations = find_conversations_by_user(
        current_user["email"]
    )

    response = []

    for conversation in conversations:

        response.append(
            {
                "conversation_id": str(
                    conversation["_id"]
                ),
                "title": conversation["title"],
                "created_at": conversation[
                    "created_at"
                ],
                "updated_at": conversation[
                    "updated_at"
                ],
            }
        )

    return response


# ==================================================
# Rename Conversation
# ==================================================

def rename_user_conversation(
    conversation_id: str,
    title: str,
    current_user: dict,
):

    user_email = current_user["email"]

    conversation = find_conversation_by_id(
        conversation_id,
        user_email,
    )

    if conversation is None:
        return None

    updated = rename_conversation(
        conversation_id,
        title,
        user_email,
    )

    if updated is None:
        return None

    return {
        "message": (
            "Conversation renamed successfully"
        ),
        "title": updated["title"],
    }


# ==================================================
# Delete Conversation
# ==================================================

def delete_user_conversation(
    conversation_id: str,
    current_user: dict,
):

    user_email = current_user["email"]

    conversation = find_conversation_by_id(
        conversation_id,
        user_email,
    )

    if conversation is None:
        return None

    result = delete_conversation(
        conversation_id,
        user_email,
    )

    if result is None:
        return None

    return {
        "message": (
            "Conversation deleted successfully"
        )
    }


# ==================================================
# Conversation Messages
# ==================================================

def get_conversation_messages(
    conversation_id: str,
    current_user: dict,
):

    user_email = current_user["email"]

    conversation = find_conversation_by_id(
        conversation_id,
        user_email,
    )

    if conversation is None:
        return None

    return get_chat_history(
        conversation_id
    )