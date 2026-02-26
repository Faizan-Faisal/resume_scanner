import redis
import os
from dotenv import load_dotenv
from app.core.logging import logger

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))

try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=True
    )
    
    redis_client.ping()
    logger.info("Connected to Redis successfully")

except Exception as e:
    logger.error(f"Redis connection failed: {str(e)}")
    raise e