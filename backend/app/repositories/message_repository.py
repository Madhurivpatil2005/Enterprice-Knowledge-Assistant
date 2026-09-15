from bson import ObjectId

from app.core.database import db

message_collection = db["messages"]


# ---------------- Save ----------------

def create_message(message: dict):
    result = message_collection.insert_one(message)
    return result.inserted_id


# ---------------- Get Conversation ----------------

def find_messages(
    conversation_id: str,
):
    return list(
        message_collection.find(
            {
                "conversation_id": conversation_id
            }
        ).sort(
            "created_at",
            1,
        )
    )


# ---------------- Delete ----------------

def delete_messages(
    conversation_id: str,
):
    return message_collection.delete_many(
        {
            "conversation_id": conversation_id
        }
    )