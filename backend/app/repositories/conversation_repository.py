from datetime import datetime, timezone

from bson import ObjectId
from pymongo import ReturnDocument

from app.core.database import db
from app.repositories.message_repository import delete_messages


conversation_collection = db["conversations"]


# ==================================================
# Create Conversation
# ==================================================

def create_conversation(
    conversation: dict,
):
    result = conversation_collection.insert_one(
        conversation
    )

    return result.inserted_id


# ==================================================
# Get User Conversations
# ==================================================

def find_conversations_by_user(
    user_email: str,
):
    return list(
        conversation_collection.find(
            {
                "user_email": user_email
            }
        ).sort(
            "updated_at",
            -1,
        )
    )


# ==================================================
# Find Conversation By ID + Owner
# ==================================================

def find_conversation_by_id(
    conversation_id: str,
    user_email: str,
):
    return conversation_collection.find_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        }
    )


# ==================================================
# Rename Conversation
# ==================================================

def rename_conversation(
    conversation_id: str,
    title: str,
    user_email: str,
):
    return conversation_collection.find_one_and_update(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        },
        {
            "$set": {
                "title": title,
                "updated_at": datetime.now(
                    timezone.utc
                ),
            }
        },
        return_document=ReturnDocument.AFTER,
    )


# ==================================================
# Delete Conversation
# ==================================================

def delete_conversation(
    conversation_id: str,
    user_email: str,
):
    # Delete messages only after confirming
    # that the conversation belongs to this user.

    conversation = conversation_collection.find_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        }
    )

    if conversation is None:
        return None

    delete_messages(
        conversation_id
    )

    return conversation_collection.delete_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        }
    )


# ==================================================
# Update Timestamp
# ==================================================

def update_conversation_timestamp(
    conversation_id: str,
    user_email: str,
):
    result = conversation_collection.update_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        },
        {
            "$set": {
                "updated_at": datetime.now(
                    timezone.utc
                )
            }
        }
    )

    print("Timestamp Updated")
    print(
        "Matched:",
        result.matched_count
    )
    print(
        "Modified:",
        result.modified_count
    )

    return result


# ==================================================
# Update Title
# ==================================================

def update_conversation_title(
    conversation_id: str,
    title: str,
    user_email: str,
):
    result = conversation_collection.update_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        },
        {
            "$set": {
                "title": title,
                "updated_at": datetime.now(
                    timezone.utc
                ),
            }
        }
    )

    print("Conversation Title Updated")
    print("New Title:", title)
    print(
        "Matched:",
        result.matched_count
    )
    print(
        "Modified:",
        result.modified_count
    )

    updated = conversation_collection.find_one(
        {
            "_id": ObjectId(conversation_id),
            "user_email": user_email,
        }
    )

    if updated:
        print(
            "MongoDB Title:",
            updated["title"]
        )

    return result