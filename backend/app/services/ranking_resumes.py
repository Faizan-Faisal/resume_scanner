from app.db.redis_client import async_redis_client

def get_ranking_key(job_id: str) -> str:
    return f"job:{job_id}:ranking"


async def update_ranking(job_id: str, resume_id: str, score: float):
    """
    Add resume to Redis sorted set and return rank.
    """

    key = get_ranking_key(job_id)

    # Add resume with score
    await async_redis_client.zadd(
        key,
        {resume_id: score}
    )

    # Get rank (descending)
    rank = await async_redis_client.zrevrank(key, resume_id)

    if rank is None:
        return None

    return rank + 1


async def get_top_resumes(job_id: str, limit: int = 50):
    """
    Get ranked resume IDs from Redis
    """

    key = get_ranking_key(job_id)

    ranked_ids = await async_redis_client.zrevrange(
        key,
        0,
        limit - 1
    )

    return ranked_ids