from app.auth.passsword import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.models.user_model import create_user_document
from app.repositories.user_repository import (
    find_by_email,
    create_user,
)


def register_user(full_name: str, email: str, password: str):

    existing_user = find_by_email(email)

    if existing_user:
        return None

    hashed_password = hash_password(password)

    user = create_user_document(
        full_name,
        email,
        hashed_password,
    )

    create_user(user)

    return user

def login_user(email: str, password: str):

    user = find_by_email(email)

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    token = create_access_token(
        {
            "sub": user["email"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def get_user_profile(user: dict):
    return {
        "full_name": user["full_name"],
        "email": user["email"],
    }