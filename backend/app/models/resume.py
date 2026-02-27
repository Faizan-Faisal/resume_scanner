from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResumeModel(BaseModel):
    job_id: str
    filename: str
    source: str
    status: str = "Queued"
    file_path: str
    created_at: datetime = datetime.utcnow()
    retry_count: int = 0
    error_message: Optional[str] = None
    scores: Optional[dict] = None