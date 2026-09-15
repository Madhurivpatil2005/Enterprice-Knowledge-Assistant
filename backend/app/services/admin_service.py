from app.repositories.admin_repository import (
    find_all_users,
    find_user_by_email,
    update_user_role,
)

from app.services.audit_service import record_audit_log


# ==================================================
# GET ALL USERS
# ==================================================

def get_all_users():

    users = find_all_users()

    response = []

    for user in users:

        response.append(
            {
                "user_id": str(user["_id"]),
                "full_name": user.get(
                    "full_name",
                    "",
                ),
                "email": user["email"],
                "role": user.get(
                    "role",
                    "user",
                ),
                "created_at": user["created_at"],
            }
        )

    return response


# ==================================================
# GET USER DETAILS
# ==================================================

def get_user_details(
    email: str,
):

    user = find_user_by_email(email)

    if user is None:
        return None

    return {
        "user_id": str(user["_id"]),
        "full_name": user.get(
            "full_name",
            "",
        ),
        "email": user["email"],
        "role": user.get(
            "role",
            "user",
        ),
        "created_at": user["created_at"],
    }


# ==================================================
# PROMOTE USER
# ==================================================

def promote_user(
    email: str,
    admin_email: str,
):

    user = update_user_role(
        email,
        "admin",
    )

    if user is None:
        return None

    record_audit_log(
        user_email=admin_email,
        action="USER_PROMOTED",
        resource_type="user",
        resource_id=str(user["_id"]),
        details=f"Promoted {email} to admin",
    )

    return {
        "user_id": str(user["_id"]),
        "full_name": user.get(
            "full_name",
            "",
        ),
        "email": user["email"],
        "role": user.get(
            "role",
            "user",
        ),
        "created_at": user["created_at"],
    }


# ==================================================
# DEMOTE USER
# ==================================================

def demote_user(
    email: str,
    admin_email: str,
):

    user = update_user_role(
        email,
        "user",
    )

    if user is None:
        return None

    record_audit_log(
        user_email=admin_email,
        action="USER_DEMOTED",
        resource_type="user",
        resource_id=str(user["_id"]),
        details=f"Changed {email} to user",
    )

    return {
        "user_id": str(user["_id"]),
        "full_name": user.get(
            "full_name",
            "",
        ),
        "email": user["email"],
        "role": user.get(
            "role",
            "user",
        ),
        "created_at": user["created_at"],
    }