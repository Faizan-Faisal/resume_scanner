import os
import zipfile
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.crud.resume import create_resume, count_resumes_by_job, get_job_summary, get_resumes_by_job
from app.db.redis_client import redis_client
from app.core.logging import logger
from app.core.exceptions import AppException
from uuid import uuid4
from app.schemas.resume import JobSummaryOut, ResumeOut
from typing import Optional
from app.utils.gdrive import extract_folder_id, list_files_in_folder, download_file


router = APIRouter(tags=["Resumes"])

UPLOAD_DIR = "temp_uploads"
ALLOWED_EXTENSIONS = [".pdf", ".docx"]
MAX_FILE_SIZE_MB = 5

def get_resume_limit_for_job(job_id: str) -> int:
    # Temporary logic (everyone is free)
    return 20


os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/jobs/{job_id}/resumes/zip")
async def upload_zip(job_id: str, file: UploadFile = File(...)):

    if not file.filename.endswith(".zip"):
        raise AppException("INVALID_FILE_TYPE", "Only ZIP files allowed", 400)

    job_resume_count = count_resumes_by_job(job_id)
    resume_limit = get_resume_limit_for_job(job_id)
    if job_resume_count >= resume_limit:
        raise AppException(
            "RESUME_LIMIT_EXCEEDED",
            f"Maximum {resume_limit} resumes allowed per job",
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

            if count_resumes_by_job(job_id) >= resume_limit:
                logger.warning("Resume limit reached during ZIP upload")
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

@router.get("/jobs/{job_id}/summary", response_model=JobSummaryOut)
def job_summary(job_id: str):
    return get_job_summary(job_id)



@router.get("/jobs/{job_id}/resumes", response_model=list[ResumeOut])
def list_resumes(job_id: str, status: Optional[str] = None):
    return get_resumes_by_job(job_id, status)

@router.post("/jobs/{job_id}/resumes/gdrive")
def upload_from_gdrive(job_id: str, folder_url: str):

    # ✅ 1️⃣ Global limit check (same as ZIP)
    resume_limit = get_resume_limit_for_job(job_id)
    job_resume_count = count_resumes_by_job(job_id)

    if job_resume_count >= resume_limit:
        raise AppException(
            "RESUME_LIMIT_EXCEEDED",
            f"Maximum {resume_limit} resumes allowed per job",
            400
        )

    try:
        folder_id = extract_folder_id(folder_url)
    except ValueError:
        raise AppException("INVALID_GDRIVE_URL", "Invalid Google Drive folder URL", 400)

    try:
        files = list_files_in_folder(folder_id)
    except Exception:
        raise AppException("GDRIVE_ACCESS_ERROR", "Unable to access Google Drive folder", 400)

    if not files:
        raise AppException("EMPTY_FOLDER", "No files found in folder", 400)

    job_folder = os.path.join(UPLOAD_DIR, str(uuid4()))
    os.makedirs(job_folder, exist_ok=True)

    resumes_registered = 0

    ALLOWED_MIME_TYPES = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    for file in files:

        # ✅ 2️⃣ Stop if limit reached during loop
        if count_resumes_by_job(job_id) >= resume_limit:
            logger.warning("Resume limit reached during GDrive upload")
            break

        ext = os.path.splitext(file["name"])[1].lower()

        if file["mimeType"] not in ALLOWED_MIME_TYPES:
            continue

        if ext not in ALLOWED_EXTENSIONS:
            continue

        destination_path = os.path.join(job_folder, file["name"])

        try:
            os.makedirs(os.path.dirname(destination_path), exist_ok=True)
            download_file(file["id"], destination_path)

            if not os.path.exists(destination_path):
                logger.warning(f"File not found after download: {file['name']}")
                continue

        except Exception as e:
            logger.warning(f"Failed to download {file['name']}: {str(e)}")
            continue

        resume_id = create_resume({
            "job_id": job_id,
            "filename": file["name"],
            "source": "GoogleDrive",
            "file_path": destination_path
        })

        redis_client.rpush("resume_queue", resume_id)
        logger.info(f"GDrive resume pushed to queue: {resume_id}")

        resumes_registered += 1

    return {
        "message": "Google Drive folder processed",
        "resumes_registered": resumes_registered
    }