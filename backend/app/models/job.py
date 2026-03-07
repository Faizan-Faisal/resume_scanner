from pydantic import BaseModel
from typing import Optional, Dict, List


class JobModel(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    min_experience: int
    weights: Dict[str, float]
    job_embedding: List[float]
    status: str = "Open"