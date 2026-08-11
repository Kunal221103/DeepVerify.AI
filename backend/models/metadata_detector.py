import os
import hashlib

from PIL import Image


def detect_metadata(path):
    """
    Extract basic file and image metadata.

    This module does NOT claim that metadata proves
    an image is real or fake.
    """

    size = os.path.getsize(path)

    sha = hashlib.sha256()

    with open(path, "rb") as f:

        while True:

            chunk = f.read(4096)

            if not chunk:
                break

            sha.update(chunk)

    result = {
        "metadata_score": 50,
        "sha256": sha.hexdigest(),
        "file_size": size,
        "format": None,
        "width": None,
        "height": None,
        "exif_present": False,
        "exif_fields": 0,
    }

    try:

        image = Image.open(path)

        result["format"] = image.format
        result["width"] = image.width
        result["height"] = image.height

        exif = image.getexif()

        if exif:

            result["exif_present"] = True
            result["exif_fields"] = len(exif)

    except Exception:

        # Non-image files can still have SHA256/file-size metadata.
        pass

    return result