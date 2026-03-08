from bson import ObjectId
from app.db.mongodb import resumes_collection


async def get_resumes_by_ids(resume_ids: list[str]):

    object_ids = [ObjectId(rid) for rid in resume_ids]

    resumes = await resumes_collection.find(
        {"_id": {"$in": object_ids}}
    ).to_list(length=len(object_ids))

    return resumes