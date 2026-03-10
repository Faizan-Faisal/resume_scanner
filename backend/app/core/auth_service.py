from datetime import datetime, timedelta

from app.crud.user import (
    get_user_by_email,
    create_user,
    verify_user,
    set_reset_code,
    update_password
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_verification_code
)

from app.utils.email_service import send_verification_email , send_password_reset_email
from app.core.logging import logger
from app.core.exceptions import AppException
from app.db.redis_client import redis_client


class AuthService:

    async def signup(self, data):

        logger.info(f"Signup attempt for {data.email}")

        existing = await get_user_by_email(data.email)

        if existing:
            raise AppException("USER_EXISTS", "User already exists", 400)

        hashed = hash_password(data.password)

        await create_user({
            "name": data.name,
            "email": data.email,
            "password": hashed
        })

        code = generate_verification_code()

        redis_client.setex(
            f"verify:{data.email}",
            600,
            code
        )

        await send_verification_email(data.email, code)

        logger.info(f"Verification code generated for {data.email}")


    async def verify_email(self, email, code):

        stored_code = redis_client.get(f"verify:{email}")

        if not stored_code:
            raise AppException("CODE_EXPIRED", "Verification code expired", 400)

        if stored_code != code:
            raise AppException("INVALID_CODE", "Invalid verification code", 400)

        await verify_user(email)

        redis_client.delete(f"verify:{email}")

        logger.info(f"Email verified: {email}")



    async def login(self, data):

        logger.info(f"Login attempt for {data.email}")

        user = await get_user_by_email(data.email)

        if not user:
            raise AppException("INVALID_CREDENTIALS", "Invalid email or password", 401)

        if not verify_password(data.password, user["password"]):
            raise AppException("INVALID_CREDENTIALS", "Invalid email or password", 401)

        if not user["is_verified"]:
            raise AppException("EMAIL_NOT_VERIFIED", "Verify your email first", 401)

        token = create_access_token(str(user["_id"]))

        logger.info(f"Login success: {data.email}")

        return token



    async def forgot_password(self, email: str):

        logger.info(f"Forgot password requested: {email}")

        user = await get_user_by_email(email)

        if not user:
            raise AppException("USER_NOT_FOUND", "User does not exist", 404)

        code = generate_verification_code()

        expiry = datetime.utcnow() + timedelta(minutes=10)

        await set_reset_code(email, code, expiry)

        await send_password_reset_email(email, code)

        logger.info(f"Password reset code generated for {email}")


    async def reset_password(self, email: str, code: str, new_password: str):

        logger.info(f"Password reset attempt: {email}")

        user = await get_user_by_email(email)

        if not user:
            raise AppException("USER_NOT_FOUND", "User not found", 404)

        if user.get("reset_code") != code:
            raise AppException("INVALID_CODE", "Invalid reset code", 400)

        if datetime.utcnow() > user["reset_expiry"]:
            raise AppException("CODE_EXPIRED", "Reset code expired", 400)

        hashed_password = hash_password(new_password)

        await update_password(email, hashed_password)

        logger.info(f"Password successfully reset for {email}")

    
    async def resend_verification_email(self, email: str):

        logger.info(f"Resend verification requested: {email}")

        user = await get_user_by_email(email)

        # Check if email exists
        if not user:
            raise AppException("USER_NOT_FOUND", "Email is not registered", 404)

        # Check if already verified
        if user["is_verified"]:
            raise AppException(
                "ALREADY_VERIFIED",
                "Email is already verified",
                400
            )

        # Generate new verification code
        code = generate_verification_code()

        redis_client.setex(
            f"verify:{email}",
            600,
            code
        )

        await send_verification_email(email, code)

        logger.info(f"Verification email resent to {email}")