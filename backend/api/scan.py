import os
import uuid
import traceback

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.analyzer import analyze
from services.history_manager import save_scan
from services.report_generator import generate_report

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

        if not isinstance(result, dict):
            raise ValueError("analyze() must return a dictionary.")

        score = result.get("score")

        if score is None:
            raise ValueError("Analysis returned no score.")

        if score >= 90:
            verdict = "AUTHENTIC"

        elif score >= 75:
            verdict = "SUSPICIOUS"

        else:
            verdict = "DEEPFAKE"

        result["verdict"] = verdict
        result["scan_id"] = scan_id

        # Generate PDF report
        report_path = generate_report(
            scan_id=scan_id,
            original_name=file.filename,
            media_type=media_type,
            result=result
        )
        
        # Add report path to result
        result["report"] = report_path
        
        # Save complete scan information
        save_scan(
            filename,
            file.filename,
            media_type,
            filepath,
            result
        )

        return result

    except HTTPException:
        raise

    except Exception as e:

        print("\n========== SCAN ERROR ==========")
        traceback.print_exc()
        print("================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        ) from e

    finally:

        if os.path.exists(filepath):
            os.remove(filepath)
