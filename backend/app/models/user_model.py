from datetime import datetime, timezone


def create_user_document(
    full_name,
    email,
    hashed_password,
):
    return {
        "full_name": full_name,
        "email": email.lower(),
        "password": hashed_password,
        "role": "user",
        "created_at": datetime.now(timezone.utc),
    }