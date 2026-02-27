from app.db.mongodb import db
from app.core.logging import logger
from datetime import datetime


def count_resumes_by_job(job_id: str):
    return db.resumes.count_documents({"job_id": job_id})

def create_resume(resume_data: dict):
    resume_data["created_at"] = datetime.utcnow()
    resume_data["status"] = "Queued"
    resume_data["retry_count"] = 0
    resume_data["error_message"] = None

    result = db.resumes.insert_one(resume_data)
    logger.info(f"Resume registered: {resume_data['filename']}")
    return str(result.inserted_id)