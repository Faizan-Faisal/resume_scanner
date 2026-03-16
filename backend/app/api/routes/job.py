
from fastapi import APIRouter, Depends

from app.schemas.job import JobCreate
from app.crud.job import create_job, get_jobs, update_job_with_structured_data
from app.services.job_parser import process_job
from app.core.auth_dependency import get_current_user
from app.db.redis_client import redis_client
router = APIRouter(tags=["Jobs"])


# @router.post("/jobs")
# async def create_job_endpoint(
#     job: JobCreate,
#     current_user: str = Depends(get_current_user),
# ):

#     # Step 1: Create job
#     job_data = {
#         "title": job.title,
#         "description": job.description,
#         "owner_id": current_user   # ✅ ADD THIS
#     }

#     created_job = await create_job(job_data)
#     job_id = str(created_job["_id"])

#     try:
#         # Step 2: Process job (LLM + embeddings)
#         structured_data = process_job(
#             description=job.description,
#             job_id=job_id,
#             weights=job.weightage_scheme
#         )

#         # Step 3: Update job with parsed data
#         updated_job = await update_job_with_structured_data(
#             job_id,     
#             structured_data
#         )
#         # updating cache for job created
#         owner_id = str(current_user.id)

#         key = f"dashboard:stats:{owner_id}"

#         redis_client.hincrby(key, "total_jobs", 1)
#         redis_client.hincrby(key, "active_jobs", 1)
#     except Exception as e:

#         # Mark job as failed
#         await update_job_with_structured_data(
#             job_id,
#             {"status": "failed"}
#         )

#         raise e

#     return {
#         "id": str(updated_job["_id"]),
#         "title": updated_job["title"],
#         "description": updated_job["description"],
#         "required_skills": updated_job["required_skills"],
#         "min_experience": updated_job["min_experience"],
#         "weights": updated_job["weights"],
#         "status": updated_job["status"],
#         "created_at": updated_job["created_at"]
#     }

@router.post("/jobs")
async def create_job_endpoint(
    job: JobCreate,
    current_user: str = Depends(get_current_user),
):

    # Step 1: Create job
    job_data = {
        "title": job.title,
        "description": job.description,
        "owner_id": current_user   # ✅ FIXED
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

        # 🔥 Update Redis dashboard stats
        key = f"dashboard:stats:{current_user}"

        redis_client.hincrby(key, "total_jobs", 1)
        redis_client.hincrby(key, "active_jobs", 1)

    except Exception as e:

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
async def list_jobs(current_user = Depends(get_current_user)):

    jobs = await get_jobs(current_user.id)

    return jobs


# When Job is Closed

# If job status becomes "Closed":

# redis_client.hincrby(key, "active_jobs", -1)