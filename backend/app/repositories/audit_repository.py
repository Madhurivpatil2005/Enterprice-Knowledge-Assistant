from app.core.database import db


audit_collection = db["audit_logs"]


# ==================================================
# CREATE AUDIT LOG
# ==================================================

def create_audit_log(log: dict):
    result = audit_collection.insert_one(log)

    return result.inserted_id


# ==================================================
# GET RECENT AUDIT LOGS
# ==================================================

def find_recent_audit_logs(
    limit: int = 50,
):
    return list(
        audit_collection.find()
        .sort(
            "created_at",
            -1,
        )
        .limit(limit)
    )


# ==================================================
# COUNT ACTION
# ==================================================

def count_action(action: str):
    return audit_collection.count_documents(
        {
            "action": action,
        }
    )


# ==================================================
# TOTAL AI REQUESTS
# ==================================================

def count_ai_requests():
    return audit_collection.count_documents(
        {
            "resource_type": "ai",
        }
    )