from ai.inference import predict


def detect_image(image_path):

    result = predict(image_path)

    real_probability = result["real_probability"]
    fake_probability = result["fake_probability"]

    # Base AI model score
    image_score = real_probability

    if fake_probability > real_probability:

        verdict_signal = "AI-generated"

    else:

        verdict_signal = "human"

    return {

        "image_score": round(
            image_score,
            2
        ),

        "real_probability": round(
            real_probability,
            2
        ),

        "fake_probability": round(
            fake_probability,
            2
        ),

        "prediction": verdict_signal,

        "confidence": result["confidence"],

        "model": (
            "CapCheck AI vs Human "
            "Generated Image Detection"
        ),

        "raw_predictions": result[
            "raw_predictions"
        ]
    }