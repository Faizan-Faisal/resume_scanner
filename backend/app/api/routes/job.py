# from fastapi import APIRouter, HTTPException
# from bson import ObjectId

# from app.schemas.job import JobCreate
# from app.crud.job import create_job, get_jobs
# from app.services.job_parser import process_job

# router = APIRouter()


# @router.post("/jobs")
# def create_job_endpoint(job: JobCreate):

#     # Step 1: Insert basic job first to generate _id
#     temp_job = {
#         "title": job.title,
#         "description": job.description
#     }

#     from app.db.mongodb import db
#     inserted = db.jobs.insert_one(temp_job)
#     job_id = str(inserted.inserted_id)

#     # Step 2: Process job (LLM + Embedding + Redis Cache)
#     structured_data = process_job(
#         description=job.description,
#         job_id=job_id,
#         weights=job.weightage_scheme
#     )

#     # Step 3: Update job with structured fields
#     db.jobs.update_one(
#         {"_id": ObjectId(job_id)},
#         {
#             "$set": {
#                 "required_skills": structured_data["required_skills"],
#                 "min_experience": structured_data["min_experience"],
#                 "weights": structured_data["weights"],
#                 "job_embedding": structured_data["job_embedding"],
#                 "status": "Open"
#             }
#         }
#     )

#     created_job = db.jobs.find_one({"_id": ObjectId(job_id)})

#     return {
#         "id": str(created_job["_id"]),
#         "title": created_job["title"],
#         "description": created_job["description"],
#         "required_skills": created_job["required_skills"],
#         "min_experience": created_job["min_experience"],
#         "weights": created_job["weights"],
#         "status": created_job["status"],
#         "created_at": created_job["created_at"],
#     }



from fastapi import APIRouter

from app.schemas.job import JobCreate
from app.crud.job import create_job, get_jobs, update_job_with_structured_data
from app.services.job_parser import process_job

router = APIRouter(tags=["Jobs"])


@router.post("/jobs")
async def create_job_endpoint(job: JobCreate):

    # Step 1: Create job
    job_data = {
        "title": job.title,
        "description": job.description
    }

    created_job = await create_job(job_data)
    job_id = str(created_job["_id"])

    try:
        # Step 2: Process job (LLM + embeddings)
        structured_data = process_job(
            description=job.description,
            job_id=job_id,
            weights=job.weightage_scheme
        )

        # Step 3: Update job with parsed data
        updated_job = await update_job_with_structured_data(
            job_id,
            structured_data
        )

    except Exception as e:

        # Mark job as failed
        await update_job_with_structured_data(
            job_id,
            {"status": "failed"}
        )

        raise e

    return {
        "id": str(updated_job["_id"]),
        "title": updated_job["title"],
        "description": updated_job["description"],
        "required_skills": updated_job["required_skills"],
        "min_experience": updated_job["min_experience"],
        "weights": updated_job["weights"],
        "status": updated_job["status"],
        "created_at": updated_job["created_at"]
    }



@router.get("/jobs")
async def list_jobs():
    jobs = await get_jobs()
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs