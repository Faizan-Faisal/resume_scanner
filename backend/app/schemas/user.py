from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    company_name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    company_name: str
    email: EmailStr