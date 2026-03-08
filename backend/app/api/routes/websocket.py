from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.utils.ws_manager import manager

router = APIRouter(tags=["WebSocket"])

@router.websocket("/ws/jobs/{job_id}/ranking")
async def ranking_websocket(websocket: WebSocket, job_id: str):

    await manager.connect(job_id, websocket)

    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(job_id, websocket)