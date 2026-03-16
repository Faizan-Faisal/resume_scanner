# from app.db.mongodb import db
# from app.core.logging import logger
# from datetime import datetime
# from bson import ObjectId



# def count_resumes_by_job(job_id: str):
#     return db.resumes.count_documents({"job_id": job_id})

# def create_resume(resume_data: dict):
#     resume_data["created_at"] = datetime.utcnow()
#     resume_data["status"] = "Queued"
#     resume_data["retry_count"] = 0
#     resume_data["error_message"] = None

#     result = db.resumes.insert_one(resume_data)
#     logger.info(f"Resume registered: {resume_data['filename']}")
#     return str(result.inserted_id)


# def get_resumes_by_job(job_id: str, status: str = None):
#     query = {"job_id": job_id}

#     if status:
#         query["status"] = status

#     resumes = list(db.resumes.find(query))

#     for resume in resumes:
#         resume["_id"] = str(resume["_id"])

#     return resumes


# def get_job_summary(job_id: str):
#     pipeline = [
#         {"$match": {"job_id": job_id}},
#         {
#             "$group": {
#                 "_id": "$status",
#                 "count": {"$sum": 1}
#             }
#         }
#     ]

#     results = list(db.resumes.aggregate(pipeline))

#     summary = {
#         "job_id": job_id,
#         "total": 0,
#         "queued": 0,
#         "processing": 0,
#         "completed": 0,
#         "failed": 0
#     }

#     for item in results:
#         status = item["_id"]
#         count = item["count"]

#         summary["total"] += count

#         if status == "Queued":
#             summary["queued"] = count
#         elif status == "Processing":
#             summary["processing"] = count
#         elif status == "Completed":
#             summary["completed"] = count
#         elif status == "Failed":
#             summary["failed"] = count

#     return summary



from app.core.logging import logger
from datetime import datetime
from bson import ObjectId
from app.db.mongodb import resumes_collection, jobs_collection



async def count_resumes_by_job(job_id: str):
    return await resumes_collection.count_documents({"job_id": job_id})


# async def create_resume(resume_data: dict):
#     resume_data["created_at"] = datetime.utcnow()
#     resume_data["status"] = "Queued"
#     resume_data["retry_count"] = 0
#     resume_data["error_message"] = None

#     result = await resumes_collection.insert_one(resume_data)

#     logger.info(f"Resume registered: {resume_data['filename']}")

#     return str(result.inserted_id)



async def create_resume(resume_data: dict):

    job_id = resume_data["job_id"]

    # 🔹 Get job to retrieve owner_id
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})

    if not job:
        raise Exception("Job not found")

    resume_data["owner_id"] = job["owner_id"]

    resume_data["created_at"] = datetime.utcnow()
    resume_data["status"] = "Queued"
    resume_data["retry_count"] = 0
    resume_data["error_message"] = None

    result = await resumes_collection.insert_one(resume_data)

    logger.info(f"Resume registered: {resume_data['filename']}")

    return str(result.inserted_id)


async def get_resumes_by_job(job_id: str, status: str = None):
    query = {"job_id": job_id}

    if status:
        query["status"] = status

    cursor = resumes_collection.find(query)
    resumes = await cursor.to_list(length=None)

    for resume in resumes:
        resume["_id"] = str(resume["_id"])

    return resumes


async def get_job_summary(job_id: str):

    pipeline = [
        {"$match": {"job_id": job_id}},
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        }
    ]

    cursor = resumes_collection.aggregate(pipeline)
    results = await cursor.to_list(length=None)

    summary = {
        "job_id": job_id,
        "total": 0,
        "queued": 0,
        "processing": 0,
        "completed": 0,
        "failed": 0
    }

    for item in results:
        status = item["_id"]
        count = item["count"]

        summary["total"] += count

        if status == "Queued":
            summary["queued"] = count
        elif status == "Processing":
            summary["processing"] = count
        elif status == "Completed":
            summary["completed"] = count
        elif status == "Failed":
            summary["failed"] = count

    return summary