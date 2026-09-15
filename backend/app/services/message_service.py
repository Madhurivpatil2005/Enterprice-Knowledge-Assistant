from app.models.message_model import create_message

from app.repositories.message_repository import (
    create_message as save_message,
    find_messages,
)


# -----------------------------------------
# Save User Message
# -----------------------------------------

def save_user_message(
    conversation_id: str,
    question: str,
):

    message = create_message(
        conversation_id=conversation_id,
        role="user",
        content=question,
    )

    save_message(message)


# -----------------------------------------
# Save Assistant Message
# -----------------------------------------

def save_assistant_message(
    conversation_id: str,
    answer: str,
    sources,
):

    message = create_message(
        conversation_id=conversation_id,
        role="assistant",
        content=answer,
        sources=sources,
    )

    save_message(message)


# -----------------------------------------
# Get Chat History
# -----------------------------------------

def get_chat_history(
    conversation_id: str,
):

    messages = find_messages(
        conversation_id
    )

    response = []

    for message in messages:

        response.append(
            {
                "role": message["role"],
                "content": message["content"],
                "sources": message["sources"],
                "created_at": message["created_at"],
            }
        )

    return response