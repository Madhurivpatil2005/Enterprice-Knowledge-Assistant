from datetime import datetime

from pydantic import BaseModel


# ==================================================
# USER RESPONSE
# ==================================================

class AdminUserResponse(BaseModel):
    user_id: str
    full_name: str
    email: str
    role: str
    created_at: datetime


# ==================================================
# AUDIT LOG RESPONSE
# ==================================================

class AuditLogResponse(BaseModel):
    log_id: str
    user_email: str
    action: str
    resource_type: str
    resource_id: str | None = None
    details: str | None = None
    created_at: datetime


# ==================================================
# ANALYTICS OVERVIEW
# ==================================================

class AnalyticsOverviewResponse(BaseModel):
    total_users: int
    total_documents: int
    total_conversations: int
    total_messages: int
    total_ai_requests: int


# ==================================================
# USAGE ANALYTICS
# ==================================================

class AnalyticsUsageResponse(BaseModel):
    chat_requests: int
    summary_requests: int
    keyword_requests: int
    key_point_requests: int
    faq_requests: int
    interview_requests: int
    suggested_question_requests: int


# ==================================================
# ACTIVITY ANALYTICS
# ==================================================

class AnalyticsActivityResponse(BaseModel):
    recent_activity: list[AuditLogResponse]