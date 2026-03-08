import redis
import redis.asyncio as redis_async
import os
from dotenv import load_dotenv
from app.core.logging import logger

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))


# -------------------------------
# Sync Redis Client (Worker/Queue)
# -------------------------------
try:

    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=True
    )

    redis_client.ping()
    logger.info("Connected to Redis successfully (sync client)")

except Exception as e:
    logger.error(f"Redis connection failed: {str(e)}")
    raise e


# --------------------------------
# Async Redis Client (FastAPI)
# --------------------------------
async_redis_client = redis_async.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True
)