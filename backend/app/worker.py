import json
from bson import ObjectId
from datetime import datetime
import os
from app.db.redis_client import redis_client
from app.db.mongodb import resumes_collection, jobs_collection
from app.core.logging import logger

from app.services.candidate_info import extract_candidate_info
from app.services.resume_parser import extract_text
from app.services.cleaner import clean_text
from app.services.resume_matcher import (
    extract_resume_experience,
    compute_skills_score
)
from app.services.embedding import embeddings
from app.services.scoring import (
    compute_semantic_score,
    compute_experience_score,
    compute_final_score
)

QUEUE_NAME = "resume_queue"
MAX_RETRIES = 3


def get_job_data(job_id: str):
    """
    Fetch job metadata from Redis.
    Fallback to MongoDB if not found.
    """

    cached_job = redis_client.get(f"job:{job_id}")

    if cached_job:
        return json.loads(cached_job)

    # Fallback safety
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})

    if not job:
        raise Exception("Job not found")

    job_data = {
        "job_embedding": job["job_embedding"],
        "required_skills": job.get("required_skills", []),
        "min_experience": job.get("min_experience", 0),
        "weights": job.get("weights", {
            "semantic": 0.3,
            "skills": 0.5,
            "experience": 0.2
        })
    }

    # Re-cache in Redis
    redis_client.set(f"job:{job_id}", json.dumps(job_data))

    return job_data


def start_worker():
    logger.info("Worker started. Waiting for jobs...")

    processed_count = 0
    failed_count = 0

    while True:
        # 🔍 Check queue size before consuming
        queue_size = redis_client.llen(QUEUE_NAME)
        logger.info(f"Queue size before pop: {queue_size}")
        
        _, resume_id = redis_client.blpop(QUEUE_NAME)

        logger.info(f"Picked resume_id: {resume_id}")

        try:
            resumes_collection.update_one(
                {"_id": ObjectId(resume_id)},
                {"$set": {"status": "Processing"}}
            )

            resume = resumes_collection.find_one(
                {"_id": ObjectId(resume_id)}
            )

            job_id = str(resume["job_id"])

            # 🔥 Fetch job from Redis (optimized)
            job_data = get_job_data(job_id)

            # 1️⃣ Extract Resume Text
            raw_text = extract_text(resume["file_path"])
            cleaned_text = clean_text(raw_text)
            
            # NEW: Extract candidate information
            candidate_info = extract_candidate_info(raw_text)

            candidate_name = candidate_info.get("name")
            candidate_email = candidate_info.get("email")
            # 2️⃣ Experience
            resume_experience = extract_resume_experience(cleaned_text)

            # 3️⃣ Resume Embedding
            resume_embedding = embeddings.embed_query(cleaned_text)

            # 4️⃣ Job Data
            job_embedding = job_data["job_embedding"]
            required_skills = job_data["required_skills"]
            min_experience = job_data["min_experience"]
            weights = job_data["weights"]

            # 5️⃣ Compute Scores
            semantic_score = compute_semantic_score(
                job_embedding,
                resume_embedding
            )

            skills_score = compute_skills_score(
                required_skills,
                cleaned_text
            )

            experience_score = compute_experience_score(
                min_experience,
                resume_experience
            )

            final_score = compute_final_score(
                semantic_score,
                skills_score,
                experience_score,
                weights
            )
            # 6️⃣ Update Resume
            resumes_collection.update_one(
                {"_id": ObjectId(resume_id)},
                {
                    "$set": {
                        "status": "Completed",
                        "candidate": {
                            "name": candidate_name,
                            "email": candidate_email
                        },

                        "scores": {
                            "semantic_score": round(semantic_score, 3),
                            "skills_score": round(skills_score, 3),
                            "experience_score": round(experience_score, 3),
                            "final_score": final_score
                        },
                        "processed_at": datetime.utcnow(),
                        "error_message": None
                    }
                }
            )

             # 7️⃣ Publish Event (Phase 4)
            redis_client.publish(
                "resume_completed",
                json.dumps({
                    "job_id": job_id,
                    "resume_id": resume_id,
                    "final_score": final_score,
                    "name": candidate_name,
                    "email": candidate_email
                })
            )

            # ✅ SAFE FILE CLEANUP AFTER SUCCESS
            file_path = resume["file_path"]

            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted processed file: {file_path}")

                # # Optional: remove parent folder if empty
                # parent_folder = os.path.dirname(file_path)
                # if os.path.exists(parent_folder) and not os.listdir(parent_folder):
                #     os.rmdir(parent_folder)
                #     logger.info(f"Deleted empty folder: {parent_folder}")

            processed_count += 1
            logger.info(f"Successfully Completed: {resume_id}")

        except Exception as e:
            logger.error(f"Error processing {resume_id}: {str(e)}")

            resume = resumes_collection.find_one(
                {"_id": ObjectId(resume_id)}
            )
            retry_count = resume.get("retry_count", 0)

            if retry_count < MAX_RETRIES:
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
                logger.warning(
                    f"Retrying resume {resume_id} (Retry {retry_count + 1})"
                )

            else:
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