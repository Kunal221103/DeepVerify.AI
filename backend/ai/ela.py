from PIL import Image, ImageChops
import os
import tempfile


def calculate_ela_score(image_path, quality=90):
    """
    Calculate Error Level Analysis (ELA).

    Higher difference means more JPEG recompression
    difference.

    This is a forensic signal only. It is NOT itself
    an authenticity probability.
    """

    image = Image.open(
        image_path
    ).convert("RGB")

    temp_file = tempfile.NamedTemporaryFile(
        suffix=".jpg",
        delete=False
    )

    temp_path = temp_file.name

    temp_file.close()

    try:

        image.save(
            temp_path,
            "JPEG",
            quality=quality
        )

        compressed = Image.open(
            temp_path
        ).convert("RGB")

        diff = ImageChops.difference(
            image,
            compressed
        )

        extrema = diff.getextrema()

        max_diff = max(
            channel[1]
            for channel in extrema
        )

        mean_diff = sum(
            channel[0]
            for channel in extrema
        ) / len(extrema)

        return {

            "ela_score": round(
                float(max_diff),
                2
            ),

            "ela_mean_difference": round(
                float(mean_diff),
                2
            ),

            "quality": quality

        }

    finally:

        if os.path.exists(temp_path):

            os.remove(temp_path)