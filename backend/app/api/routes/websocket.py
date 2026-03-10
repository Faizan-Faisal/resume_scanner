# from fastapi import APIRouter, WebSocket, WebSocketDisconnect
# from app.utils.ws_manager import manager

# router = APIRouter(tags=["WebSocket"])

# @router.websocket("/ws/jobs/{job_id}/ranking")
# async def ranking_websocket(websocket: WebSocket, job_id: str):

#     await manager.connect(job_id, websocket)

#     try:
#         while True:
#             # Keep connection alive
#             await websocket.receive_text()

#     except WebSocketDisconnect:
#         manager.disconnect(job_id, websocket)


from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.utils.ws_manager import manager
from app.core.ws_security import verify_ws_token
from app.crud.job import get_job_by_id
from app.core.logging import logger

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/jobs/{job_id}/ranking")
async def ranking_websocket(websocket: WebSocket, job_id: str):

    # 1️⃣ Get token from query
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    # 2️⃣ Validate JWT
    user_id = verify_ws_token(token)

    if not user_id:
        await websocket.close(code=1008)
        return

    # 3️⃣ Validate job ownership  ← ADD IT HERE
    job = await get_job_by_id(job_id)

    if not job:
        await websocket.close(code=1008)
        return

    if job["user_id"] != user_id:
        await websocket.close(code=1008)
        return

    # 4️⃣ Accept connection
    await manager.connect(job_id, websocket)

    logger.info(f"WebSocket connected | user={user_id} job={job_id}")

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(job_id, websocket)

        logger.info(f"WebSocket disconnected | user={user_id}")