from app.db.mongodb import users_collection
from datetime import datetime


async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})


async def create_user(user_data: dict):
    user_data["created_at"] = datetime.utcnow()
    user_data["is_verified"] = False
    await users_collection.insert_one(user_data)


async def verify_user(email: str):
    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )


async def set_reset_code(email: str, code: str, expiry):
    await users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "reset_code": code,
                "reset_expiry": expiry
            }
        }
    )


async def update_password(email: str, hashed_password: str):
    await users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed_password,
                "reset_code": None,
                "reset_expiry": None
            }
        }
    )