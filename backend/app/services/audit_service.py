from datetime import datetime, timezone

from app.repositories.audit_repository import (
    create_audit_log,
    find_recent_audit_logs,
)


# ==================================================
# CREATE AUDIT LOG
# ==================================================

def record_audit_log(
    user_email: str,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    details: str | None = None,
):
    log = {
        "user_email": user_email,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details,
        "created_at": datetime.now(timezone.utc),
    }

    return create_audit_log(log)


# ==================================================
# RECENT AUDIT LOGS
# ==================================================

def get_recent_audit_logs(
    limit: int = 50,
):
    logs = find_recent_audit_logs(limit)

    response = []

    for log in logs:
        response.append(
            {
                "log_id": str(log["_id"]),
                "user_email": log["user_email"],
                "action": log["action"],
                "resource_type": log["resource_type"],
                "resource_id": log.get("resource_id"),
                "details": log.get("details"),
                "created_at": log["created_at"],
            }
        )

    return response