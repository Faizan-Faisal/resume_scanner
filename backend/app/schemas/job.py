from pydantic import BaseModel
from typing import Optional, List

class JobCreate(BaseModel):
    title: str
    description: str
    resume_source: str  # "zip" or "google_drive_link"
    weightage_scheme: Optional[dict] = None

class JobOut(BaseModel):
    title: str
    description: str
    status: str
    results: Optional[List[dict]] = []