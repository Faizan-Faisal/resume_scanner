# import time
# from bson import ObjectId
# from app.db.redis_client import redis_client
# from app.db.mongodb import resumes_collection
# from app.core.logging import logger

# QUEUE_NAME = "resume_queue"

# def start_worker():
#     logger.info("Worker started. Waiting for jobs...")

#     processed_count = 0  # Counter for processed resumes

#     while True:
#         # Blocking pop from Redis queue
#         _, resume_id = redis_client.blpop(QUEUE_NAME)
#         # resume_id = resume_id.decode("utf-8")

#         logger.info(f"Picked resume_id: {resume_id}")

#         # -----------------------------
#         # 1️⃣ Mark as Processing
#         # -----------------------------
#         resumes_collection.update_one(
#             {"_id": ObjectId(resume_id)},
#             {"$set": {"status": "Processing"}}
#         )

#         logger.info(f"Marked as Processing: {resume_id}")

#         # -----------------------------
#         # Simulate processing
#         # -----------------------------
#         time.sleep(5)

#         # -----------------------------
#         # 2️⃣ Mark as Processed
#         # -----------------------------
#         resumes_collection.update_one(
#             {"_id": ObjectId(resume_id)},
#             {"$set": {"status": "Processed"}}
#         )

#         processed_count += 1

#         # -----------------------------
#         # Metrics
#         # -----------------------------
#         remaining_in_queue = redis_client.llen(QUEUE_NAME)

#         logger.info(
#             f"Finished resume_id: {resume_id} | "
#             f"Total Processed: {processed_count} | "
#             f"Remaining In Queue: {remaining_in_queue}"
#         )

#         # Optional: Publish completion event
#         redis_client.publish("resume_completed", resume_id)


# if __name__ == "__main__":
#     start_worker()


import time
from bson import ObjectId
from app.db.redis_client import redis_client
from app.db.mongo import resumes_collection
from app.core.logging import logger

QUEUE_NAME = "resume_queue"
MAX_RETRIES = 3

def start_worker():
    logger.info("Worker started. Waiting for jobs...")

    processed_count = 0
    failed_count = 0

    while True:
        _, resume_id = redis_client.blpop(QUEUE_NAME)
        resume_id = resume_id.decode("utf-8")

        logger.info(f"Picked resume_id: {resume_id}")

        try:
            # Mark as Processing
            resumes_collection.update_one(
                {"_id": ObjectId(resume_id)},
                {"$set": {"status": "Processing"}}
            )

            logger.info(f"Marked as Processing: {resume_id}")

            # -----------------------------
            # Simulate processing
            # -----------------------------
            time.sleep(5)

            # 🔥 Simulate random failure (for testing)
            # remove later
            # if random.choice([True, False]):
            #     raise Exception("Simulated parsing failure")

            # Mark as Processed
            resumes_collection.update_one(
                {"_id": ObjectId(resume_id)},
                {
                    "$set": {
                        "status": "Processed",
                        "error_message": None
                    }
                }
            )

            processed_count += 1
            logger.info(f"Successfully processed: {resume_id}")

        except Exception as e:
            logger.error(f"Error processing {resume_id}: {str(e)}")

            resume = resumes_collection.find_one({"_id": ObjectId(resume_id)})
            retry_count = resume.get("retry_count", 0)

            if retry_count < MAX_RETRIES:
                # Retry
                resumes_collection.update_one(
                    {"_id": ObjectId(resume_id)},
                    {
                        "$inc": {"retry_count": 1},
                        "$set": {
                            "status": "Queued",
                            "error_message": str(e)
                        }
                    }
                )

                redis_client.rpush(QUEUE_NAME, resume_id)
                logger.warning(f"Retrying resume {resume_id} (Retry {retry_count + 1})")

            else:
                # Mark as Failed
                resumes_collection.update_one(
                    {"_id": ObjectId(resume_id)},
                    {
                        "$set": {
                            "status": "Failed",
                            "error_message": str(e)
                        }
                    }
                )

                failed_count += 1
                logger.error(f"Resume marked as FAILED: {resume_id}")

        remaining = redis_client.llen(QUEUE_NAME)

        logger.info(
            f"Metrics → Processed: {processed_count} | "
            f"Failed: {failed_count} | "
            f"Remaining In Queue: {remaining}"
        )


if __name__ == "__main__":
    start_worker()