from PIL import Image, ImageChops
import os
import tempfile


def calculate_ela_score(image_path, quality=90):
    """
    Returns:
        ela_score (0-100)
        ela_image_path
    """

    image = Image.open(image_path).convert("RGB")

    temp_file = tempfile.NamedTemporaryFile(
        suffix=".jpg",
        delete=False
    ).name

    image.save(temp_file, "JPEG", quality=quality)

    compressed = Image.open(temp_file)

    diff = ImageChops.difference(image, compressed)

    extrema = diff.getextrema()

    max_diff = max([x[1] for x in extrema])

    if max_diff == 0:
        ela_score = 100

    else:
        ela_score = max(0, 100 - max_diff)

    return {
        "ela_score": round(ela_score, 2),
        "ela_image": temp_file
    }