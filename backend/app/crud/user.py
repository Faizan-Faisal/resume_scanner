from app.db.mongodb import db
from app.core.logging import logger
from app.core.security import hash_password, verify_password, create_access_token

def create_user(company_name: str, email: str, password: str):
    logger.info(f"Creating user for email: {email}")
    existing = db.users.find_one({"email": email})
    if existing:
        logger.warning(f"Cannot create user: email {email} already exists")
        return None

    hashed = hash_password(password)
    user = {"company_name": company_name, "email": email, "password": hashed}
    db.users.insert_one(user)
    logger.info(f"User created: {email}")
    return user

def authenticate_user(email: str, password: str):
    logger.info(f"Authenticating user: {email}")
    user = db.users.find_one({"email": email})
    if not user:
        logger.warning(f"User not found: {email}")
        return None
    if not verify_password(password, user["password"]):
        logger.warning(f"Invalid password for user: {email}")
        return None
    logger.info(f"User authenticated: {email}")
    return user

def generate_token(user):
    token = create_access_token({"sub": str(user["_id"]), "company": user["company_name"]})
    logger.info(f"Token generated for user: {user['email']}")
    return token