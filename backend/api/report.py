import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse


router = APIRouter(
    prefix="/api",
    tags=["Reports"]
)


REPORT_DIR = os.path.abspath("reports")


@router.get("/report/{scan_id}")
def download_report(scan_id: str):

    if not scan_id:
        raise HTTPException(
            status_code=400,
            detail="Missing scan ID."
        )

    filename = f"{scan_id}.pdf"

    filepath = os.path.join(
        REPORT_DIR,
        filename
    )

    print("\n========== REPORT REQUEST ==========")
    print("Scan ID:", scan_id)
    print("Report:", filepath)
    print("Exists:", os.path.isfile(filepath))
    print("====================================\n")

    if not os.path.isfile(filepath):

        raise HTTPException(
            status_code=404,
            detail="Report not found."
        )

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename=filename,
        content_disposition_type="inline"
    )