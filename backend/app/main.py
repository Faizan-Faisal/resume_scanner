from fastapi import FastAPI, Request
from app.api.routes import auth, job, resume, websocket, ranking_routes, dashboard
from app.core.logging import logger
import uuid
from app.db.redis_client import redis_client

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import AppException
from app.core.logging import logger

import asyncio

from app.services.pubsub_listeners import listen_for_events


app = FastAPI()

# Middleware for logging requests/responses
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(f"Incoming request {request.method} {request.url}", extra={"request_id": request_id})
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}", extra={"request_id": request_id})
    return response

@app.exception_handler(AppException)
async def app_exception_handler(request, exc: AppException):
    logger.error(f"AppException: {exc.code} - {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request parameters",
                "details": exc.errors()
            }
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    logger.exception("Unexpected server error")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Something went wrong"
            }
        },
    )

# Include auth routes
app.include_router(auth.router, prefix="/auth")
app.include_router(job.router, )
app.include_router(resume.router, prefix="/resumes")
app.include_router(websocket.router)
app.include_router(ranking_routes.router)
app.include_router(dashboard.router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(listen_for_events())



@app.get("/")
def root():
    logger.info("Root endpoint called")
    return {"message": "API is running"}



@app.get("/redis-test")
def redis_test():
    redis_client.rpush("test_queue", "hello")
    value = redis_client.lpop("test_queue")
    return {"value": value}

@app.get("/redis-pubsub-test")
def redis_pubsub_test():
    redis_client.publish("test_channel", "hello_event")
    return {"message": "Event published"}

@app.get("/push-job")
def push_job():
    redis_client.rpush("resume_queue", "resume_123")
    return {"message": "Job pushed"}