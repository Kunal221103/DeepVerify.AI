import cv2
import numpy as np


def calculate_noise_score(image_path):
    """
    Estimate image noise using Laplacian variance.

    Returns:
        noise_score (0-100)
        variance
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Cannot open image: {image_path}")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    variance = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    # Normalize variance to a score
    if variance >= 500:
        score = 100

    elif variance >= 300:
        score = 90

    elif variance >= 200:
        score = 80

    elif variance >= 120:
        score = 70

    elif variance >= 80:
        score = 60

    elif variance >= 50:
        score = 50

    elif variance >= 25:
        score = 40

    else:
        score = 25

    return {

        "noise_score": round(score, 2),

        "noise_variance": round(float(variance), 2)

    }