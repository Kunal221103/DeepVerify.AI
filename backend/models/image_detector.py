from ai.inference import predict
from ai.second_detector import predict_second
from ai.sdxl_detector import predict_sdxl


def detect_image(image_path):

    # ======================================================
    # PRIMARY MODEL
    # ======================================================

    primary = predict(image_path)

    # ======================================================
    # SECONDARY MODEL
    # ======================================================

    secondary_predictions = predict_second(
        image_path
    )

    secondary_real = 0.0
    secondary_fake = 0.0

    for prediction in secondary_predictions:

        label = prediction["label"].lower()

        confidence = float(
            prediction["confidence"]
        )

        if label in (
            "real",
            "human"
        ):

            secondary_real = confidence

        elif label in (
            "ai_generated",
            "ai-generated",
            "ai generated"
        ):

            secondary_fake = confidence

    # ======================================================
    # SDXL DETECTOR
    # ======================================================

    sdxl_predictions = predict_sdxl(
        image_path
    )

    sdxl_real = 0.0
    sdxl_fake = 0.0

    for prediction in sdxl_predictions:

        label = prediction["label"].lower()

        confidence = float(
            prediction["confidence"]
        )

        if label in (
            "human",
            "real"
        ):

            sdxl_real = confidence

        elif label in (
            "artificial",
            "fake",
            "ai-generated",
            "ai_generated"
        ):

            sdxl_fake = confidence

    # ======================================================
    # PRIMARY IMAGE SCORE
    #
    # SDXL is currently our strongest validated detector.
    # ======================================================

    image_score = sdxl_real

    # ======================================================
    # VERDICT SIGNAL
    # ======================================================

    if sdxl_fake >= 70:

        prediction = "AI-generated"

    elif sdxl_fake >= 45:

        prediction = "Suspicious"

    else:

        prediction = "Human"

    return {

        "image_score": round(
            image_score,
            2
        ),

        "real_probability": round(
            sdxl_real,
            2
        ),

        "fake_probability": round(
            sdxl_fake,
            2
        ),

        "prediction": prediction,

        "confidence": round(
            max(
                sdxl_real,
                sdxl_fake
            ),
            2
        ),

        "primary_model": primary,

        "secondary_model": {

            "real_probability": round(
                secondary_real,
                2
            ),

            "fake_probability": round(
                secondary_fake,
                2
            )

        },

        "sdxl_model": {

            "real_probability": round(
                sdxl_real,
                2
            ),

            "fake_probability": round(
                sdxl_fake,
                2
            )

        }

    }