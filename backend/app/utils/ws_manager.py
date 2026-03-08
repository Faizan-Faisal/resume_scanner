# from fastapi import WebSocket
# from collections import defaultdict

# class ConnectionManager:

#     def __init__(self):
#         self.active_connections = defaultdict(list)

#     async def connect(self, job_id: str, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections[job_id].append(websocket)

#     def disconnect(self, job_id: str, websocket: WebSocket):
#         if websocket in self.active_connections[job_id]:
#             self.active_connections[job_id].remove(websocket)

#     async def broadcast(self, job_id: str, message: dict):
#         connections = self.active_connections.get(job_id, [])

#         for connection in connections:
#             await connection.send_json(message)


# manager = ConnectionManager()

from fastapi import WebSocket
from collections import defaultdict


class ConnectionManager:

    def __init__(self):
        # job_id -> set of websocket connections
        self.active_connections = defaultdict(set)

    async def connect(self, job_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[job_id].add(websocket)

    def disconnect(self, job_id: str, websocket: WebSocket):

        if websocket in self.active_connections[job_id]:
            self.active_connections[job_id].remove(websocket)

        # cleanup empty job groups
        if not self.active_connections[job_id]:
            del self.active_connections[job_id]

    async def broadcast(self, job_id: str, message: dict):

        connections = self.active_connections.get(job_id)

        if not connections:
            return

        dead_connections = []

        for websocket in connections:
            try:
                await websocket.send_json(message)

            except Exception:
                # connection is dead
                dead_connections.append(websocket)

        # remove dead sockets
        for websocket in dead_connections:
            connections.remove(websocket)

        # cleanup empty job group
        if not connections:
            del self.active_connections[job_id]


manager = ConnectionManager()