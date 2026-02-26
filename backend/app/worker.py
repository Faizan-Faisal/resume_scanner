import time
from app.db.redis_client import redis_client
from app.core.logging import logger

QUEUE_NAME = "resume_queue"

def start_worker():
    logger.info("Worker started. Waiting for jobs...")

    while True:
        _, resume_id = redis_client.blpop(QUEUE_NAME)
        logger.info(f"Processing resume_id: {resume_id}")

        # Simulate processing
        time.sleep(5)

        # Publish completion event
        redis_client.publish("resume_completed", resume_id)
        logger.info(f"Finished processing resume_id: {resume_id}")

if __name__ == "__main__":
    start_worker()