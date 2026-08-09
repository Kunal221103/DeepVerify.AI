from fastapi import APIRouter

from services.history_manager import get_history


router = APIRouter(
    prefix="/api",
    tags=["History"]
)


@router.get("/history")
def history():

    return get_history()