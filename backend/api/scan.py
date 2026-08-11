import os
import uuid
import traceback

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.analyzer import analyze
from services.history_manager import save_scan

router = APIRouter(
    prefix="/api",
    tags=["Scan"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

VIDEO_EXT = [".mp4", ".avi", ".mov", ".mkv", ".webm"]
AUDIO_EXT = [".wav", ".mp3", ".m4a"]
IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"]

MAX_FILE_SIZE = 200 * 1024 * 1024  # 200 MB


@router.post("/scan")
async def scan(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Missing filename."
        )

    ext = os.path.splitext(file.filename)[1].lower()

    if ext in VIDEO_EXT:
        media_type = "video"

    elif ext in AUDIO_EXT:
        media_type = "audio"

    elif ext in IMAGE_EXT:
        media_type = "image"

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )

    scan_id = str(uuid.uuid4())
    filename = f"{scan_id}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    size = 0

    try:

        with open(filepath, "wb") as buffer:

            while True:

                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="File too large."
                    )

                buffer.write(chunk)

    finally:
        await file.close()

    try:
        result = analyze(filepath, media_type)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}"
        ) from exc

    if not isinstance(result, dict):
        raise ValueError("analyze() must return a dictionary.")

    score = result.get("score")

    if score is None:
        raise ValueError("Analysis returned no score.")

    # ==========================================================
    # FINAL VERDICT
    # ==========================================================

    if media_type == "image":
        verdict = result.get(
            "verdict",
            "SUSPICIOUS"
        )
        final_confidence = result.get(
            "score",
            0
        )
    else:
        if score >= 90:
            verdict = "AUTHENTIC"
        elif score >= 75:
            verdict = "SUSPICIOUS"
        else:
            verdict = "DEEPFAKE"
        final_confidence = score

    result["verdict"] = verdict
    result["score"] = round(
        final_confidence,
        2
    )
    result["scan_id"] = scan_id
    result["filename"] = file.filename
    result["media_type"] = media_type

    return result
