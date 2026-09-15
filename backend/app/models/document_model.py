from datetime import datetime, timezone
from bson import ObjectId


def create_document(
    filename: str,
    file_path: str,
    user_email: str,
):
    return {
        "_id": ObjectId(),
        "filename": filename,
        "file_path": file_path,
        "user_email": user_email,
        "uploaded_at": datetime.now(timezone.utc),
    }