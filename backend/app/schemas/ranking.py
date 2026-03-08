from pydantic import BaseModel
from typing import Optional, List


class RankedResume(BaseModel):
    rank: int
    resume_id: str
    filename: Optional[str]
    final_score: float
    email: Optional[str]
    name: Optional[str]
    ai_summary: Optional[str]


class RankingResponse(BaseModel):
    job_id: str
    ranking: List[RankedResume]