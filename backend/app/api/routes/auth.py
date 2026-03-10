from fastapi import APIRouter
from app.schemas.user import *
from app.core.auth_service import AuthService

router = APIRouter( tags=["Auth"])

auth_service = AuthService()


@router.post("/signup")
async def signup(data: UserSignup):

    await auth_service.signup(data)

    return {"message": "Verification email sent"}


@router.post("/verify")
async def verify_email(data: EmailVerification):

    await auth_service.verify_email(data.email, data.code)

    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
async def resend_verification(data: ResendVerification):

    await auth_service.resend_verification_email(data.email)

    return {
        "message": "Verification email resent successfully"
    }


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):

    token = await auth_service.login(data)

    return {"access_token": token}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword):

    await auth_service.forgot_password(data.email)

    return {
        "message": "Password reset code sent to email"
    }


@router.post("/reset-password")
async def reset_password(data: ResetPassword):

    await auth_service.reset_password(
        data.email,
        data.code,
        data.new_password
    )

    return {
        "message": "Password reset successfully"
    }
