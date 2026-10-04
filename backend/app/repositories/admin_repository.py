from pymongo import ReturnDocument

from app.core.database import db


users_collection = db["users"]


# ==================================================
# GET ALL USERS
# ==================================================

def find_all_users():

    return list(
        users_collection.find(
            {},
            {
                "password": 0,
            },
        ).sort(
            "created_at",
            -1,
        )
    )


# ==================================================
# GET USER
# ==================================================

def find_user_by_email(
    email: str,
):

    return users_collection.find_one(
        {
            "email": email.lower(),
        },
        {
            "password": 0,
        },
    )


# ==================================================
# CHANGE ROLE
# ==================================================

def update_user_role(
    email: str,
    role: str,
):

    return users_collection.find_one_and_update(
        {
            "email": email.lower(),
        },
        {
            "$set": {
                "role": role,
            }
        },
        projection={
            "password": 0,
        },
        return_document=ReturnDocument.AFTER,
    )


# ==================================================
# DELETE USER
# ==================================================

def delete_user_by_email(
    email: str,
):

    return users_collection.find_one_and_delete(
        {
            "email": email.lower(),
        },
        projection={
            "password": 0,
        },
    )