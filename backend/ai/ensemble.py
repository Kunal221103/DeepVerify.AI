# backend/ai/ensemble.py

from typing import Any


def get_fake_probability(
    predictions: Any,
    positive_labels: list[str],
) -> float:

    # ======================================================
    # MODEL 1 RETURNS A DICTIONARY
    # ======================================================

    if isinstance(predictions, dict):

        if "fake_probability" in predictions:

            return float(
                predictions["fake_probability"]
            )

        if "real_probability" in predictions:

            return 100.0 - float(
                predictions["real_probability"]
            )

        # If dictionary contains raw predictions
        if "raw_predictions" in predictions:

            predictions = predictions["raw_predictions"]

    # ======================================================
    # MODEL 2 / MODEL 3 RETURN A LIST
    # ======================================================

    if isinstance(predictions, list):

        positive_labels = [
            label.lower()
            for label in positive_labels
        ]

        for prediction in predictions:

            if not isinstance(
                prediction,
                dict
            ):
                continue

            label = str(
                prediction.get(
                    "label",
                    ""
                )
            ).lower()

            confidence = float(
                prediction.get(
                    "confidence",
                    0
                )
            )

            if any(
                positive in label
                for positive in positive_labels
            ):

                return confidence

    return 0.0


def calculate_ensemble(
    model1_predictions,
    model2_predictions,
    model3_predictions,
):

    # ======================================================
    # GET FAKE PROBABILITIES
    # ======================================================

    model1_fake = get_fake_probability(
        model1_predictions,
        [
            "ai-generated",
            "ai_generated",
            "fake",
            "artificial",
        ],
    )

    model2_fake = get_fake_probability(
        model2_predictions,
        [
            "ai-generated",
            "ai_generated",
            "fake",
            "artificial",
        ],
    )

    model3_fake = get_fake_probability(
        model3_predictions,
        [
            "ai-generated",
            "ai_generated",
            "fake",
            "artificial",
        ],
    )

    # ======================================================
    # REAL PROBABILITIES
    # ======================================================

    model1_real = 100.0 - model1_fake
    model2_real = 100.0 - model2_fake
    model3_real = 100.0 - model3_fake

    # ======================================================
    # PRIMARY DECISION
    #
    # Model 3 showed the strongest separation in our
    # benchmark, so it is the primary signal.
    # ======================================================

    if model3_fake >= 70:

        verdict = "DEEPFAKE"

        confidence = model3_fake

    elif model3_fake >= 40:

        # Model 2 can strengthen the manipulation signal
        if model2_fake >= 70:

            verdict = "DEEPFAKE"

            confidence = max(
                model2_fake,
                model3_fake,
            )

        else:

            verdict = "SUSPICIOUS"

            confidence = max(
                model3_fake,
                model2_fake,
            )

    else:

        # Strong Model 2 manipulation evidence
        if model2_fake >= 80:

            verdict = "DEEPFAKE"

            confidence = model2_fake

        else:

            verdict = "AUTHENTIC"

            confidence = max(
                model1_real,
                model2_real,
                model3_real,
            )

    # ======================================================
    # OVERALL PROBABILITIES
    # ======================================================

    fake_score = max(
        model1_fake,
        model2_fake,
        model3_fake,
    )

    real_score = 100.0 - fake_score

    # ======================================================
    # FINAL RESULT
    # ======================================================

    return {

        "verdict": verdict,

        "score": round(
            confidence,
            2,
        ),

        "fake_probability": round(
            fake_score,
            2,
        ),

        "real_probability": round(
            real_score,
            2,
        ),

        "model_evidence": {

            "model_1": {
                "fake_probability": round(
                    model1_fake,
                    2,
                ),
                "real_probability": round(
                    model1_real,
                    2,
                ),
            },

            "model_2": {
                "fake_probability": round(
                    model2_fake,
                    2,
                ),
                "real_probability": round(
                    model2_real,
                    2,
                ),
            },

            "model_3": {
                "fake_probability": round(
                    model3_fake,
                    2,
                ),
                "real_probability": round(
                    model3_real,
                    2,
                ),
            },
        },
    }