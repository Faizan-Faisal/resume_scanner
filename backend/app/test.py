import asyncio
import websockets
import json

# JOB_ID = "69ac6f5cc550b0bbff6ebe4c"

async def listen():

    # uri = f"ws://localhost:8000/ws/jobs/{JOB_ID}/ranking"
    uri = f"ws://localhost:8000/ws/jobs/69ac7c18c550b0bbff6ebe57/ranking"

    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket")

        while True:
            message = await websocket.recv()
            data = json.loads(message)

            print("Received event:")
            print(data)


asyncio.run(listen())