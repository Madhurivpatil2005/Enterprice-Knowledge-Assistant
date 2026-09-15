from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.auth.dependencies import get_current_user

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
)

from app.services.auth_service import (
    register_user,
    login_user,
    get_user_profile,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ---------------- REGISTER ---------------- #

@router.post("/register")
def register(user: UserRegister):

    created_user = register_user(
        user.full_name,
        user.email,
        user.password,
    )

    if created_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    return {
        "message": "User registered successfully",
        "email": created_user["email"],
        "full_name": created_user["full_name"],
    }


# ---------------- JSON LOGIN (React/Postman) ---------------- #

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(user: UserLogin):

    token = login_user(
        user.email,
        user.password,
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return token


# ---------------- SWAGGER LOGIN ---------------- #

@router.post(
    "/token",
    response_model=TokenResponse,
)
def token_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):

    print("=" * 50)
    print("Username:", form_data.username)
    print("Password:", form_data.password)
    print("=" * 50)

    token = login_user(
        form_data.username,
        form_data.password,
    )

    print("Returned Token:", token)

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return token

# ---------------- CURRENT USER ---------------- #

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: dict = Depends(get_current_user),
):

    return get_user_profile(current_user)