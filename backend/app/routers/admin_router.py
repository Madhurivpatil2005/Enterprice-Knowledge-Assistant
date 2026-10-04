from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.services.admin_service import (
    get_all_users,
    get_user_details,
    promote_user,
    demote_user,
    delete_user,
)


from app.auth.dependencies import require_admin

from app.schemas.admin_schema import (
    AdminUserResponse,
    AuditLogResponse,
    AnalyticsOverviewResponse,
    AnalyticsUsageResponse,
    AnalyticsActivityResponse,
)

from app.services.admin_service import (
    get_all_users,
    get_user_details,
    promote_user,
    demote_user,
)

from app.services.audit_service import (
    get_recent_audit_logs,
)

from app.services.analytics_service import (
    get_analytics_overview,
    get_usage_analytics,
    get_activity_analytics,
)
from app.services.analytics_service import (
    get_user_analytics,
    get_user_activity,
    get_user_documents,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ==================================================
# USERS
# ==================================================

@router.get(
    "/users",
    response_model=list[AdminUserResponse],
)
def get_users(
    current_admin: dict = Depends(
        require_admin
    ),
):
    return get_all_users()


# ==================================================
# USER DETAILS
# ==================================================

@router.get(
    "/users/{email}",
    response_model=AdminUserResponse,
)
def get_user(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(email)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# ==================================================
# PROMOTE
# ==================================================

@router.put(
    "/users/{email}/promote",
    response_model=AdminUserResponse,
)
def promote(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = promote_user(
        email=email,
        admin_email=current_admin["email"],
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# ==================================================
# DEMOTE
# ==================================================

@router.put(
    "/users/{email}/demote",
    response_model=AdminUserResponse,
)
def demote(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    # Prevent admin from accidentally
    # removing their own admin role.

    if email.lower() == current_admin["email"].lower():
        raise HTTPException(
            status_code=400,
            detail="You cannot demote yourself",
        )

    user = demote_user(
        email=email,
        admin_email=current_admin["email"],
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# ==================================================
# DELETE USER
# ==================================================

@router.delete(
    "/users/{email}",
)
def delete(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    # Prevent admin from deleting
    # their own account.

    if email.lower() == current_admin["email"].lower():
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    deleted = delete_user(
        email=email,
        admin_email=current_admin["email"],
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "message": "User deleted successfully",
        "email": email,
    }

# ==================================================
# AUDIT LOGS
# ==================================================

@router.get(
    "/audit-logs",
    response_model=list[AuditLogResponse],
)
def audit_logs(
    current_admin: dict = Depends(
        require_admin
    ),
):

    return get_recent_audit_logs(50)


# ==================================================
# ANALYTICS OVERVIEW
# ==================================================

@router.get(
    "/analytics/overview",
    response_model=AnalyticsOverviewResponse,
)
def analytics_overview(
    current_admin: dict = Depends(
        require_admin
    ),
):

    return get_analytics_overview()


# ==================================================
# ANALYTICS USAGE
# ==================================================

@router.get(
    "/analytics/usage",
    response_model=AnalyticsUsageResponse,
)
def analytics_usage(
    current_admin: dict = Depends(
        require_admin
    ),
):

    return get_usage_analytics()


# ==================================================
# ANALYTICS ACTIVITY
# ==================================================

@router.get(
    "/analytics/activity",
    response_model=AnalyticsActivityResponse,
)
def analytics_activity(
    current_admin: dict = Depends(
        require_admin
    ),
):

    return get_activity_analytics()


# ==================================================
# USER ANALYTICS
# ==================================================

@router.get(
    "/users/{email}/analytics"
)
def user_analytics(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_analytics(
        email
    )


# ==================================================
# USER ACTIVITY
# ==================================================

@router.get(
    "/users/{email}/activity"
)
def user_activity(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_activity(
        email
    )


# ==================================================
# USER DOCUMENTS
# ==================================================

@router.get(
    "/users/{email}/documents"
)
def user_documents(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_documents(
        email
    )

# ==================================================
# INDIVIDUAL USER ANALYTICS
# ==================================================

@router.get(
    "/users/{email}/analytics"
)
def user_analytics(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_analytics(
        email
    )


# ==================================================
# INDIVIDUAL USER ACTIVITY
# ==================================================

@router.get(
    "/users/{email}/activity"
)
def user_activity(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_activity(
        email
    )


# ==================================================
# INDIVIDUAL USER DOCUMENTS
# ==================================================

@router.get(
    "/users/{email}/documents"
)
def user_documents(
    email: str,
    current_admin: dict = Depends(
        require_admin
    ),
):

    user = get_user_details(
        email
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return get_user_documents(
        email
    )