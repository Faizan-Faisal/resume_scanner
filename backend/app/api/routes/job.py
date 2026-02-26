from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.schemas.job import JobCreate, JobOut
from app.crud.job import create_job, get_jobs
from app.core.logging import logger

router = APIRouter()

def process_resumes(job_id: str):
    """
    Placeholder for resume processing logic.
    This will run asynchronously in background.
    """
    logger.info(f"Started processing resumes for job {job_id}")
    import time
    time.sleep(5)  # simulate processing
    # After processing, update DB with result
    from app.crud.job import append_job_result, update_job_status
    append_job_result(job_id, {"candidate": "John Doe", "score": 85, "explanation": "Strong in Python"})
    update_job_status(job_id, "completed")
    logger.info(f"Completed processing resumes for job {job_id}")

@router.post("/jobs", response_model=JobOut)
def create_job_endpoint(job: JobCreate, background_tasks: BackgroundTasks):
    job_data = create_job(job.dict())
    job_id = str(job_data.get("_id"))
    background_tasks.add_task(process_resumes, job_id)
    return job_data

@router.get("/jobs")
def list_jobs():
    return get_jobs()