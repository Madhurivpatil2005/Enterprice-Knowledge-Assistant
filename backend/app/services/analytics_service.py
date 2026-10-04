from app.core.database import db

from app.repositories.audit_repository import (
    count_action,
    count_ai_requests,
    count_user_action,
    find_recent_audit_logs,
    find_user_audit_logs,
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
        "total_users":
            users_collection.count_documents({}),

        "total_documents":
            documents_collection.count_documents({}),

        "total_conversations":
            conversations_collection.count_documents({}),

        "total_messages":
            messages_collection.count_documents({}),

        "total_ai_requests":
            count_ai_requests(),
    }


# ==================================================
# AI USAGE
# ==================================================

def get_usage_analytics():

    return {
        "chat_requests":
            count_action("CHAT"),

        "summary_requests":
            count_action(
                "DOCUMENT_SUMMARY"
            ),

        "keyword_requests":
            count_action(
                "DOCUMENT_KEYWORDS"
            ),

        "key_point_requests":
            count_action(
                "DOCUMENT_KEY_POINTS"
            ),

        "faq_requests":
            count_action(
                "DOCUMENT_FAQS"
            ),

        "interview_requests":
            count_action(
                "INTERVIEW_QUESTIONS"
            ),

        "suggested_question_requests":
            count_action(
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
                "log_id":
                    str(log["_id"]),

                "user_email":
                    log["user_email"],

                "action":
                    log["action"],

                "resource_type":
                    log["resource_type"],

                "resource_id":
                    log.get(
                        "resource_id"
                    ),

                "details":
                    log.get(
                        "details"
                    ),

                "created_at":
                    log["created_at"],
            }
        )

    return {
        "recent_activity":
            response
    }


# ==================================================
# INDIVIDUAL USER ANALYTICS
# ==================================================

def get_user_analytics(
    user_email: str,
):

    email = user_email.lower()

    return {
        "user_email": email,

        "chat_requests":
            count_user_action(
                email,
                "CHAT",
            ),

        "summary_requests":
            count_user_action(
                email,
                "DOCUMENT_SUMMARY",
            ),

        "keyword_requests":
            count_user_action(
                email,
                "DOCUMENT_KEYWORDS",
            ),

        "key_point_requests":
            count_user_action(
                email,
                "DOCUMENT_KEY_POINTS",
            ),

        "faq_requests":
            count_user_action(
                email,
                "DOCUMENT_FAQS",
            ),

        "interview_requests":
            count_user_action(
                email,
                "INTERVIEW_QUESTIONS",
            ),

        "suggested_question_requests":
            count_user_action(
                email,
                "SUGGESTED_QUESTIONS",
            ),
    }


# ==================================================
# INDIVIDUAL USER ACTIVITY
# ==================================================

def get_user_activity(
    user_email: str,
    limit: int = 50,
):

    logs = find_user_audit_logs(
        user_email.lower(),
        limit,
    )

    response = []

    for log in logs:

        response.append(
            {
                "log_id":
                    str(log["_id"]),

                "user_email":
                    log["user_email"],

                "action":
                    log["action"],

                "resource_type":
                    log["resource_type"],

                "resource_id":
                    log.get(
                        "resource_id"
                    ),

                "details":
                    log.get(
                        "details"
                    ),

                "created_at":
                    log["created_at"],
            }
        )

    return {
        "activity":
            response
    }


# ==================================================
# INDIVIDUAL USER DOCUMENTS
# ==================================================

def get_user_documents(
    user_email: str,
):

    documents = list(
        documents_collection.find(
            {
                "user_email":
                    user_email.lower()
            }
        ).sort(
            "uploaded_at",
            -1,
        )
    )

    response = []

    for document in documents:

        response.append(
            {
                "document_id":
                    str(document["_id"]),

                "filename":
                    document.get(
                        "filename",
                        "",
                    ),

                "uploaded_at":
                    document.get(
                        "uploaded_at"
                    ),
            }
        )

    return {
        "documents":
            response
    }


# ==================================================
# TOTAL AI REQUESTS FOR DASHBOARD
# ==================================================

def get_total_ai_requests():

    return {
        "total_ai_requests":
            count_ai_requests()
    }

# ==================================================
# CURRENT USER AI USAGE
# ==================================================

def get_my_usage_analytics(
    user_email: str,
):

    email = user_email.lower()

    chat_requests = count_user_action(
        email,
        "CHAT",
    )

    summary_requests = count_user_action(
        email,
        "DOCUMENT_SUMMARY",
    )

    keyword_requests = count_user_action(
        email,
        "DOCUMENT_KEYWORDS",
    )

    key_point_requests = count_user_action(
        email,
        "DOCUMENT_KEY_POINTS",
    )

    faq_requests = count_user_action(
        email,
        "DOCUMENT_FAQS",
    )

    interview_requests = count_user_action(
        email,
        "INTERVIEW_QUESTIONS",
    )

    suggested_question_requests = count_user_action(
        email,
        "SUGGESTED_QUESTIONS",
    )

    total_ai_requests = (
        chat_requests
        + summary_requests
        + keyword_requests
        + key_point_requests
        + faq_requests
        + interview_requests
        + suggested_question_requests
    )

    return {
        "total_ai_requests": total_ai_requests,
        "chat_requests": chat_requests,
        "summary_requests": summary_requests,
        "keyword_requests": keyword_requests,
        "key_point_requests": key_point_requests,
        "faq_requests": faq_requests,
        "interview_requests": interview_requests,
        "suggested_question_requests":
            suggested_question_requests,
    }