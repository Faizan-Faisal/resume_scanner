from fastapi import FastAPI, Request
from app.api.routes import auth, job
from app.core.logging import logger
import uuid
from app.db.redis_client import redis_client

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
app.include_router(job.router, prefix="/jobs")

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