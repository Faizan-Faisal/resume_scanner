import json
from app.db.redis_client import async_redis_client
from app.utils.ws_manager import manager


async def listen_for_events():

    pubsub = async_redis_client.pubsub()

    await pubsub.subscribe("resume_completed")

    print("Async Redis listener started")

    async for message in pubsub.listen():

        if message["type"] != "message":
            continue

        data = json.loads(message["data"])

        job_id = data["job_id"]

        event = {
            "type": "resume_completed",
            "resume_id": data["resume_id"],
            "final_score": data["final_score"]
        }

        await manager.broadcast(job_id, event)