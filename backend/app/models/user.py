from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserModel(BaseModel):

    name: str
    email: EmailStr
    password: str

    is_verified: bool = False

    created_at: datetime = datetime.utcnow()

    reset_code: Optional[str] = None
    reset_expiry: Optional[datetime] = None