from app.utils.email import send_email


async def send_verification_email(email: str, code: str):

    body = f"""
Your verification code is: {code}

This code expires in 10 minutes.
"""

    await send_email(
        to_email=email,
        subject="Email Verification",
        body=body
    )


async def send_password_reset_email(email: str, code: str):

    body = f"""
Your password reset code is: {code}

This code expires in 10 minutes.
"""

    await send_email(
        to_email=email,
        subject="Password Reset",
        body=body
    )