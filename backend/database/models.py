from datetime import datetime


def create_scan_document(
    filename,
    original_name,
    media_type,
    filepath,
    result
):
    return {
        "filename": filename,
        "original_name": original_name,
        "media_type": media_type,
        "filepath": filepath,
        "result": result,
        "created_at": datetime.utcnow()
    }