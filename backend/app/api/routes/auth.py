from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserOut
from app.crud.user import create_user, authenticate_user, generate_token
from app.core.logging import logger

router = APIRouter(tags=["Auth"])

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate):
    logger.info(f"Signup attempt for email: {user.email}")
    created = create_user(user.company_name, user.email, user.password)
    if not created:
        raise HTTPException(status_code=400, detail="Email already exists")
    return {"company_name": created["company_name"], "email": created["email"]}

@router.post("/login")
def login(user: UserCreate):
    logger.info(f"Login attempt for email: {user.email}")
    authenticated = authenticate_user(user.email, user.password)
    if not authenticated:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = generate_token(authenticated)
    return {"access_token": token}