from pydantic import BaseModel
from typing import Optional, List

class JobModel(BaseModel):
    title: str
    description: str
    resume_source: str  # "zip" or "google_drive_link"
    weightage_scheme: Optional[dict] = None
    status: str = "pending"  # pending, processing, completed
    results: Optional[List[dict]] = []  # store candidate scores & explanation