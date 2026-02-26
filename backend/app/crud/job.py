from app.db.mongodb import db
from app.core.logging import logger

def create_job(job_data: dict):
    logger.info(f"Creating job: {job_data['title']}")
    job_data["status"] = "pending"
    db.jobs.insert_one(job_data)
    logger.info(f"Job created: {job_data['title']}")
    return job_data

def update_job_status(job_id, status: str):
    logger.info(f"Updating job {job_id} status to {status}")
    db.jobs.update_one({"_id": job_id}, {"$set": {"status": status}})

def append_job_result(job_id, result: dict):
    logger.info(f"Appending result for job {job_id}: {result}")
    db.jobs.update_one({"_id": job_id}, {"$push": {"results": result}})

def get_jobs():
    jobs = list(db.jobs.find())
    logger.info(f"Fetched {len(jobs)} jobs")
    return jobs

def get_job_by_id(job_id):
    job = db.jobs.find_one({"_id": job_id})
    logger.info(f"Fetched job {job_id}")
    return job