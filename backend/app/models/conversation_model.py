from datetime import datetime, timezone
from bson import ObjectId


def create_conversation(
    title: str,
    user_email: str,
):
    return {
        "_id": ObjectId(),
        "title": title,
        "user_email": user_email,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }