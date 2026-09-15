from bson import ObjectId
from pymongo import ReturnDocument

from app.core.database import db


documents_collection = db["documents"]


# ==================================================
# Create Document
# ==================================================

def create_document(document: dict):
    result = documents_collection.insert_one(document)
    return result.inserted_id


# ==================================================
# Find Document
# ==================================================

def find_document(document_id):
    return documents_collection.find_one(
        {
            "_id": document_id
        }
    )


# ==================================================
# Find Document By ID + Owner
# ==================================================

def find_document_by_id(
    document_id: str,
    user_email: str,
):
    return documents_collection.find_one(
        {
            "_id": ObjectId(document_id),
            "user_email": user_email,
        }
    )


# ==================================================
# Find User Documents
# ==================================================

def find_documents_by_user(
    user_email: str,
):
    return list(
        documents_collection.find(
            {
                "user_email": user_email
            }
        ).sort(
            "uploaded_at",
            -1
        )
    )


# ==================================================
# Rename Document
# ==================================================

def rename_document(
    document_id: str,
    new_filename: str,
    user_email: str,
):
    return documents_collection.find_one_and_update(
        {
            "_id": ObjectId(document_id),
            "user_email": user_email,
        },
        {
            "$set": {
                "filename": new_filename
            }
        },
        return_document=ReturnDocument.AFTER,
    )


# ==================================================
# Search Documents
# ==================================================

def search_documents(
    user_email: str,
    filename: str,
):
    return list(
        documents_collection.find(
            {
                "user_email": user_email,
                "filename": {
                    "$regex": filename,
                    "$options": "i"
                }
            }
        ).sort(
            "uploaded_at",
            -1
        )
    )


# ==================================================
# Duplicate Check
# ==================================================

def document_exists(
    user_email: str,
    filename: str,
):
    return documents_collection.find_one(
        {
            "user_email": user_email,
            "filename": filename,
        }
    )


# ==================================================
# Statistics
# ==================================================

def count_documents(
    user_email: str,
):
    return documents_collection.count_documents(
        {
            "user_email": user_email
        }
    )


# ==================================================
# Delete Document
# ==================================================

def delete_document(
    document_id: str,
    user_email: str,
):
    return documents_collection.delete_one(
        {
            "_id": ObjectId(document_id),
            "user_email": user_email,
        }
    )