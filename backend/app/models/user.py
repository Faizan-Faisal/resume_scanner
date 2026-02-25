from pydantic import BaseModel, EmailStr
from bson import ObjectId

class UserModel(BaseModel):
    company_name: str
    email: EmailStr
    password: str