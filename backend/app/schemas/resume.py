from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeOut(BaseModel):
    job_id: str
    filename: str
    status: str
    source: str
    created_at: datetime
    retry_count: int = 0
    error_message: Optional[str] = None
    scores: Optional[dict] = None