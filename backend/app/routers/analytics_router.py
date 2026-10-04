from fastapi import APIRouter, Depends

from app.auth.dependencies import (
    get_current_user,
)

from app.services.analytics_service import (
    get_my_usage_analytics,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


# ==================================================
# CURRENT USER AI USAGE
# ==================================================

@router.get(
    "/my-usage"
)
def my_usage(
    current_user: dict = Depends(
        get_current_user
    ),
):

    return get_my_usage_analytics(
        current_user["email"]
    )