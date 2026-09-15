from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.auth.jwt_handler import verify_access_token
from app.repositories.user_repository import find_by_email


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/token"
)


# ==================================================
# Get Current Logged-In User
# ==================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    payload = verify_access_token(token)

    # ------------------------------------------
    # Invalid / expired token
    # ------------------------------------------

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # ------------------------------------------
    # Get email from token
    # ------------------------------------------

    email = payload.get("sub")

    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    # ------------------------------------------
    # Find user in MongoDB
    # ------------------------------------------

    user = find_by_email(email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # ------------------------------------------
    # Backward compatibility
    # ------------------------------------------
    # Existing users created before RBAC may not
    # have a "role" field.
    #
    # Treat them as normal users.

    if "role" not in user:
        user["role"] = "user"

    return user


# ==================================================
# Require Administrator
# ==================================================

def require_admin(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow access only to administrators.
    """

    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required",
        )

    return current_user