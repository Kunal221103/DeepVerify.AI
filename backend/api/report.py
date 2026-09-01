import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse


router = APIRouter(
    prefix="/api",
    tags=["Reports"]
)


REPORT_DIR = "reports"

os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


@router.get("/report/{scan_id}")
async def download_report(scan_id: str):

    # ==========================================================
    # VALIDATE SCAN ID
    # ==========================================================

    if not scan_id or not scan_id.strip():

        raise HTTPException(
            status_code=400,
            detail="Missing scan ID."
        )


    # ==========================================================
    # LOCATE EXISTING PDF
    # ==========================================================

    pdf_path = os.path.join(
        REPORT_DIR,
        f"{scan_id}.pdf"
    )


    # ==========================================================
    # CHECK FILE
    # ==========================================================

    if not os.path.isfile(pdf_path):

        raise HTTPException(
            status_code=404,
            detail="PDF report not found."
        )


    # ==========================================================
    # RETURN PDF
    # ==========================================================

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"DeepVerify_Report_{scan_id}.pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="DeepVerify_Report_{scan_id}.pdf"'
        }
    )