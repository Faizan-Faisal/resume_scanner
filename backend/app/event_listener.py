import json
import asyncio

from app.db.redis_client import redis_client
from app.utils.ws_manager import manager


async def start_event_listener():

    pubsub = redis_client.pubsub()
    pubsub.subscribe("resume_completed")

    print("Event listener started...")

    for message in pubsub.listen():

        if message["type"] != "message":
            continue

        data = json.loads(message["data"])

        job_id = data["job_id"]

        event = {
            "type": "resume_completed",
            "resume_id": data["resume_id"],
            "final_score": data["final_score"]
        }

        asyncio.create_task(manager.broadcast(job_id, event))


if __name__ == "__main__":
    asyncio.run(start_event_listener())