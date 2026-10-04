from app.core.database import db


audit_collection = db["audit_logs"]


# ==================================================
# CREATE AUDIT LOG
# ==================================================

def create_audit_log(log: dict):

    result = audit_collection.insert_one(
        log
    )

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
# GET USER AUDIT LOGS
# ==================================================

def find_user_audit_logs(
    user_email: str,
    limit: int = 50,
):

    return list(
        audit_collection.find(
            {
                "user_email": user_email.lower(),
            }
        )
        .sort(
            "created_at",
            -1,
        )
        .limit(limit)
    )


# ==================================================
# COUNT ACTION
# ==================================================

def count_action(
    action: str,
):

    return audit_collection.count_documents(
        {
            "action": action,
        }
    )


# ==================================================
# COUNT USER ACTION
# ==================================================

def count_user_action(
    user_email: str,
    action: str,
):

    return audit_collection.count_documents(
        {
            "user_email": user_email.lower(),
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


# ==================================================
# TOTAL USER AI REQUESTS
# ==================================================

def count_user_ai_requests(
    user_email: str,
):

    return audit_collection.count_documents(
        {
            "user_email": user_email.lower(),
            "resource_type": "ai",
        }
    )