from datetime import datetime, timezone
from bson import ObjectId


def create_message(
    conversation_id: str,
    role: str,
    content: str,
    sources=None,
):
    return {
        "_id": ObjectId(),
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
        "sources": sources or [],
        "created_at": datetime.now(timezone.utc),
    }