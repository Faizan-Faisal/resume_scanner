# from app.db.mongodb import db
# from datetime import datetime
# from bson import ObjectId


# def create_job(job_data: dict):
#     job_data["status"] = "processing"
#     job_data["created_at"] = datetime.utcnow()

#     result = db.jobs.insert_one(job_data)

#     return db.jobs.find_one({"_id": result.inserted_id})


# def update_job_with_structured_data(job_id: str, structured_data: dict):
#     structured_data["status"] = "completed"
#     db.jobs.update_one(
#         {"_id": ObjectId(job_id)},
#         {
#             "$set": {
#                 "required_skills": structured_data["required_skills"],
#                 "min_experience": structured_data["min_experience"],
#                 "weights": structured_data["weights"],
#                 "job_embedding": structured_data["job_embedding"]
#             }
#         }
#     )

#     return db.jobs.find_one({"_id": ObjectId(job_id)})


# def get_jobs():
#     return list(db.jobs.find())


# def get_job_by_id(job_id: str):
#     return db.jobs.find_one({"_id": ObjectId(job_id)})



from app.db.mongodb import jobs_collection
from datetime import datetime
from bson import ObjectId


async def create_job(job_data: dict):

    job_data["status"] = "processing"
    job_data["created_at"] = datetime.utcnow()

    result = await jobs_collection.insert_one(job_data)

    job = await jobs_collection.find_one({"_id": result.inserted_id})

    job["_id"] = str(job["_id"])

    return job


async def update_job_with_structured_data(job_id: str, structured_data: dict):

    structured_data["status"] = "completed"

    await jobs_collection.update_one(
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

    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})

    job["_id"] = str(job["_id"])

    return job


async def get_jobs():

    cursor = jobs_collection.find({})
    jobs = await cursor.to_list(length=None)

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs


async def get_job_by_id(job_id: str):

    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})

    if job:
        job["_id"] = str(job["_id"])

    return job