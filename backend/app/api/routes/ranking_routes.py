from fastapi import APIRouter, Depends
from app.services.ranking_resumes import get_top_resumes
from app.crud.ranking import get_resumes_by_ids
from app.schemas.ranking import RankingResponse
from app.core.logging import logger
from app.core.auth_dependency import get_current_user

router = APIRouter(tags=["Ranking"])


@router.get("/jobs/{job_id}/ranking", response_model=RankingResponse)
async def get_job_ranking(
    job_id: str,
    limit: int = 50,
    current_user: str = Depends(get_current_user),
):

    logger.info(f"Fetching ranking for job_id={job_id}")

    ranked_ids = await get_top_resumes(job_id, limit)

    if not ranked_ids:
        logger.info(f"No ranked resumes found for job {job_id}")
        return {"job_id": job_id, "ranking": []}

    resumes = await get_resumes_by_ids(ranked_ids)

    resume_map = {
        str(r["_id"]): r for r in resumes
    }

    results = []

    for idx, rid in enumerate(ranked_ids):

        resume = resume_map.get(rid)

        if not resume:
            continue

        results.append({
            "rank": idx + 1,
            "resume_id": rid,
            "filename": resume.get("filename"),
            "final_score": resume["scores"]["final_score"],
            "email": resume.get("email"),
            "name": resume.get("name"),
            "ai_summary": resume.get("ai_summary")
        })

    logger.info(
        f"Ranking returned for job_id={job_id} | count={len(results)}"
    )

    return {
        "job_id": job_id,
        "ranking": results
    }