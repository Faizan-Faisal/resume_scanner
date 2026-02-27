import os
import zipfile
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.crud.resume import create_resume, count_resumes_by_job
from app.db.redis_client import redis_client
from app.core.logging import logger
from app.core.exceptions import AppException
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
ALLOWED_EXTENSIONS = [".pdf", ".docx"]
MAX_FILE_SIZE_MB = 5
MAX_RESUMES_PER_JOB = 20

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/jobs/{job_id}/resumes/zip")
async def upload_zip(job_id: str, file: UploadFile = File(...)):

    if not file.filename.endswith(".zip"):
        raise AppException("INVALID_FILE_TYPE", "Only ZIP files allowed", 400)

    job_resume_count = count_resumes_by_job(job_id)
    if job_resume_count >= MAX_RESUMES_PER_JOB:
        raise AppException(
            "RESUME_LIMIT_EXCEEDED",
            "Maximum 20 resumes allowed per job",
            400
        )

    temp_zip_path = os.path.join(UPLOAD_DIR, f"{uuid4()}.zip")

    with open(temp_zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_folder = os.path.join(UPLOAD_DIR, str(uuid4()))
    os.makedirs(extracted_folder, exist_ok=True)

    try:
        with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_folder)
    except zipfile.BadZipFile:
        raise AppException("INVALID_ZIP", "Corrupted ZIP file", 400)

    resumes_registered = 0

    for root, _, files in os.walk(extracted_folder):
        for filename in files:

            ext = os.path.splitext(filename)[1].lower()

            if ext not in ALLOWED_EXTENSIONS:
                continue

            file_path = os.path.join(root, filename)

            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            if size_mb > MAX_FILE_SIZE_MB:
                logger.warning(f"File too large skipped: {filename}")
                continue

            if count_resumes_by_job(job_id) >= MAX_RESUMES_PER_JOB:
                break

            resume_id = create_resume({
                "job_id": job_id,
                "filename": filename,
                "source": "ZIP",
                "file_path": file_path
            })

            redis_client.rpush("resume_queue", resume_id)
            logger.info(f"Resume pushed to queue: {resume_id}")

            resumes_registered += 1

    os.remove(temp_zip_path)

    return {
        "message": "ZIP processed",
        "resumes_registered": resumes_registered
    }