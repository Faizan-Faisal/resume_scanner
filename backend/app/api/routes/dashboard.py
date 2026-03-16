from fastapi import APIRouter, Depends
from bson import ObjectId

from app.db.mongodb import jobs_collection, resumes_collection
from app.db.redis_client import redis_client
from app.core.auth_dependency import get_current_user

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user=Depends(get_current_user)):

    user_id = str(current_user)
    key = f"dashboard:stats:{user_id}"

    stats = redis_client.hgetall(key)

    # 🔥 If Redis already has stats
    if stats:
        total_jobs = int(stats.get("total_jobs", 0))
        resumes_scanned = int(stats.get("resumes_scanned", 0))
        active_jobs = int(stats.get("active_jobs", 0))
        score_sum = float(stats.get("score_sum", 0)) 
        score_count = int(stats.get("score_count", 0))

    else:
        # 🔄 Build stats from MongoDB (first time only)

        total_jobs = await jobs_collection.count_documents({
            "owner_id": ObjectId(user_id)
        })

        resumes_scanned = await resumes_collection.count_documents({
            "owner_id": ObjectId(user_id),
            "status": "Completed"
        })

        active_jobs = await jobs_collection.count_documents({
            "owner_id": ObjectId(user_id),
            "status": "Active"
        })

        pipeline = [
            {"$match": {"owner_id": ObjectId(user_id), "status": "Completed"}},
            {"$group": {
                "_id": None,
                "score_sum": {"$sum": "$scores.final_score"},
                "score_count": {"$sum": 1}
            }}
        ]

        result = await resumes_collection.aggregate(pipeline).to_list(1)

        score_sum = result[0]["score_sum"] if result else 0
        score_count = result[0]["score_count"] if result else 0

        # 🔥 Store in Redis
        redis_client.hset(key, mapping={
            "total_jobs": total_jobs,
            "resumes_scanned": resumes_scanned,
            "active_jobs": active_jobs,
            "score_sum": score_sum,
            "score_count": score_count
        })

    avg_score = 0
    if score_count > 0:
        avg_score = round((score_sum / score_count), 2)

    return {
        "total_jobs": total_jobs,
        "resumes_scanned": resumes_scanned,
        "avg_score": avg_score,
        "active_jobs": active_jobs
    }