from fastapi import FastAPI, Request
from app.api.routes import auth
from app.core.logging import logger
import uuid

app = FastAPI()

# Middleware for logging requests/responses
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(f"Incoming request {request.method} {request.url}", extra={"request_id": request_id})
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}", extra={"request_id": request_id})
    return response

# Include auth routes
app.include_router(auth.router, prefix="/auth")

@app.get("/")
def root():
    logger.info("Root endpoint called")
    return {"message": "API is running"}