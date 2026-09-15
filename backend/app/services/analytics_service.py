from app.core.database import db

from app.repositories.audit_repository import (
    count_action,
    count_ai_requests,
)

from app.repositories.audit_repository import (
    find_recent_audit_logs,
)


users_collection = db["users"]
documents_collection = db["documents"]
conversations_collection = db["conversations"]
messages_collection = db["messages"]


# ==================================================
# OVERVIEW
# ==================================================

def get_analytics_overview():

    return {
        "total_users": users_collection.count_documents({}),

        "total_documents": documents_collection.count_documents({}),

        "total_conversations": conversations_collection.count_documents({}),

        "total_messages": messages_collection.count_documents({}),

        "total_ai_requests": count_ai_requests(),
    }


# ==================================================
# AI USAGE
# ==================================================

def get_usage_analytics():

    return {
        "chat_requests": count_action(
            "CHAT"
        ),

        "summary_requests": count_action(
            "DOCUMENT_SUMMARY"
        ),

        "keyword_requests": count_action(
            "DOCUMENT_KEYWORDS"
        ),

        "key_point_requests": count_action(
            "DOCUMENT_KEY_POINTS"
        ),

        "faq_requests": count_action(
            "DOCUMENT_FAQS"
        ),

        "interview_requests": count_action(
            "INTERVIEW_QUESTIONS"
        ),

        "suggested_question_requests": count_action(
            "SUGGESTED_QUESTIONS"
        ),
    }


# ==================================================
# RECENT ACTIVITY
# ==================================================

def get_activity_analytics():

    logs = find_recent_audit_logs(
        20
    )

    response = []

    for log in logs:

        response.append(
            {
                "log_id": str(log["_id"]),
                "user_email": log["user_email"],
                "action": log["action"],
                "resource_type": log["resource_type"],
                "resource_id": log.get(
                    "resource_id"
                ),
                "details": log.get(
                    "details"
                ),
                "created_at": log["created_at"],
            }
        )

    return {
        "recent_activity": response
    }