from jose import jwt, JWTError
from app.core.logging import logger
from dotenv import load_dotenv
import os
load_dotenv()


JWT_SECRET=os.getenv("JWT_SECRET")

def verify_ws_token(token: str):

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        user_id = payload.get("user_id")

        if not user_id:
            return None

        return user_id

    except JWTError:

        logger.warning("Invalid WebSocket token")

        return None