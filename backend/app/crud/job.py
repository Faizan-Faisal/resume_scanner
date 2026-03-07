from app.db.mongodb import db
from datetime import datetime
from bson import ObjectId


def create_job(job_data: dict):
    job_data["status"] = "processing"
    job_data["created_at"] = datetime.utcnow()

    result = db.jobs.insert_one(job_data)

    return db.jobs.find_one({"_id": result.inserted_id})


def update_job_with_structured_data(job_id: str, structured_data: dict):
    structured_data["status"] = "completed"
    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "required_skills": structured_data["required_skills"],
                "min_experience": structured_data["min_experience"],
                "weights": structured_data["weights"],
                "job_embedding": structured_data["job_embedding"]
            }
        }
    )

    return db.jobs.find_one({"_id": ObjectId(job_id)})


def get_jobs():
    return list(db.jobs.find())


def get_job_by_id(job_id: str):
    return db.jobs.find_one({"_id": ObjectId(job_id)})