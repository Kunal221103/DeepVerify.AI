from typing import Callable, cast

import cv2
import numpy as np


def calculate_noise_score(image_path):
    """
    Estimate high-frequency image detail using
    Laplacian variance.

    This is a forensic signal and should NOT be
    interpreted directly as real/fake probability.
    """

    imread = getattr(cv2, "imread", None)
    if not callable(imread):
        raise AttributeError("OpenCV cv2.imread is unavailable")

    read_image: Callable[[str], object] = imread
    image = read_image(image_path)

    if image is None:

        raise ValueError(
            f"Cannot open image: {image_path}"
        )

    color_code = getattr(cv2, "COLOR_BGR2GRAY", None)

    if color_code is None:
        color_code = 6

    try:
        gray = cv2.cvtColor(
            image,
            color_code
        )
    except (AttributeError, TypeError) as exc:
        raise AttributeError("OpenCV cv2.cvtColor is unavailable") from exc

    # Use CV_64F if available in this cv2 build; fall back to numeric value (6)
    ddepth = getattr(cv2, 'CV_64F', 6)
    laplacian = getattr(cv2, 'Laplacian', None)
    if not callable(laplacian):
        raise AttributeError("OpenCV cv2.Laplacian is unavailable")

    variance = laplacian(gray, ddepth).var()

    return {

        "noise_variance": round(
            float(variance),
            2
        ),

        "noise_measurement": round(
            float(variance),
            2
        )

    }