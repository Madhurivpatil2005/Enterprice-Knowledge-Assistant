from app.core.database import db

users_collection = db["users"]


def find_by_email(email: str):
    """
    Find a user by email.
    """
    return users_collection.find_one(
        {"email": email.lower()}
    )


def create_user(user: dict):
    """
    Insert a new user into MongoDB.
    """
    return users_collection.insert_one(user)


def find_by_id(user_id):
    """
    Find a user by MongoDB _id.
    """
    return users_collection.find_one(
        {"_id": user_id}
    )