import os
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from services.analyzer import analyze
from services.history_manager import save_scan

try:
    from services.report_generator import generate_report
except ImportError:
    def generate_report(*args, **kwargs):
        return None


router = APIRouter(
    prefix="/api",
    tags=["Scan"]
)


# ==========================================================
# CONFIGURATION
# ==========================================================

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


VIDEO_EXT = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".webm"
]


AUDIO_EXT = [
    ".wav",
    ".mp3",
    ".m4a"
]


IMAGE_EXT = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
]


MAX_FILE_SIZE = (
    200 * 1024 * 1024
)


# ==========================================================
# SCAN ENDPOINT
# ==========================================================

@router.post("/scan")
async def scan(
    file: UploadFile = File(...)
):

    # ======================================================
    # VALIDATE FILENAME
    # ======================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Missing filename."
        )


    # ======================================================
    # DETECT MEDIA TYPE
    # ======================================================

    ext = os.path.splitext(
        file.filename
    )[1].lower()


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


    # ======================================================
    # CREATE SCAN ID
    # ======================================================

    scan_id = str(
        uuid.uuid4()
    )


    filename = (
        f"{scan_id}{ext}"
    )


    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )


    # ======================================================
    # SAVE UPLOADED FILE
    # ======================================================

    size = 0

    try:

        with open(
            filepath,
            "wb"
        ) as buffer:

            while True:

                chunk = await file.read(
                    1024 * 1024
                )

                if not chunk:
                    break


                size += len(
                    chunk
                )


                if size > MAX_FILE_SIZE:

                    # Remove incomplete file
                    if os.path.exists(
                        filepath
                    ):

                        os.remove(
                            filepath
                        )

                    raise HTTPException(
                        status_code=413,
                        detail="File too large."
                    )


                buffer.write(
                    chunk
                )

    except HTTPException:

        raise

    except Exception as exc:

        if os.path.exists(
            filepath
        ):

            os.remove(
                filepath
            )

        raise HTTPException(
            status_code=500,
            detail=f"File upload failed: {str(exc)}"
        ) from exc

    finally:

        await file.close()


    # ======================================================
    # RUN ANALYSIS
    # ======================================================

    try:

        result = analyze(
            filepath,
            media_type
        )

    except Exception as exc:

        print()
        print(
            "========== SCAN ERROR =========="
        )

        import traceback

        traceback.print_exc()

        print(
            "================================"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}"
        ) from exc


    # ======================================================
    # VALIDATE RESULT
    # ======================================================

    if not isinstance(
        result,
        dict
    ):

        raise HTTPException(
            status_code=500,
            detail="Analysis returned invalid data."
        )


    # ======================================================
    # GET RESULT VALUES
    # ======================================================

    verdict = result.get(
        "verdict",
        "UNKNOWN"
    )


    confidence = result.get(
        "confidence",
        result.get(
            "score",
            0
        )
    )


    # ======================================================
    # NORMALIZE PROBABILITIES
    # ======================================================

    fake_probability = result.get(
        "fake_probability"
    )


    real_probability = result.get(
        "real_probability"
    )


    # ======================================================
    # FALLBACK FOR OLD RESULTS
    # ======================================================

    if fake_probability is None:

        if media_type == "video":

            video = result.get(
                "video",
                {}
            )

            fake_probability = video.get(
                "fake_probability",
                0
            )

        elif media_type == "audio":

            audio = result.get(
                "audio",
                {}
            )

            fake_probability = audio.get(
                "fake_probability",
                0
            )

        else:

            fake_probability = 0


    if real_probability is None:

        real_probability = (
            100.0 -
            float(fake_probability)
        )


    # ======================================================
    # FINAL RESPONSE FIELDS
    # ======================================================

    result["verdict"] = verdict

    result["confidence"] = round(
        float(confidence),
        2
    )

    result["score"] = round(
        float(confidence),
        2
    )

    result["real_probability"] = round(
        float(real_probability),
        2
    )

    result["fake_probability"] = round(
        float(fake_probability),
        2
    )

    result["scan_id"] = scan_id

    result["filename"] = file.filename

    result["media_type"] = media_type

    # ==========================================================
    # GENERATE PDF REPORT
    # ==========================================================

    report_path = None

    try:

        report_path = generate_report(
            scan_id=scan_id,
            original_name=file.filename,
            media_type=media_type,
            result=result
        )

        result["report"] = report_path

    except Exception as exc:

        print(
            f"PDF generation failed: {exc}"
        )

        result["report"] = None


    # ======================================================
    # SAVE HISTORY
    # ======================================================

    try:
        save_scan(
            filename=filename,
            original_name=file.filename,
            media_type=media_type,
            filepath=filepath,
            result=result
        )
    except Exception as exc:

        # History failure should not destroy
        # an otherwise successful scan.

        print(
            f"Warning: Failed to save history: {exc}"
        )


    # ======================================================
    # RETURN RESULT
    # ======================================================

    return result