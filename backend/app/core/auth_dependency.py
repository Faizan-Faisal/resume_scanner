from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt
from dotenv import load_dotenv
import os
load_dotenv()
JWT_SECRET=os.getenv("JWT_SECRET")

security = HTTPBearer()


def get_current_user(credentials=Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["user_id"]

    except:
        raise HTTPException(status_code=401, detail="Invalid token")