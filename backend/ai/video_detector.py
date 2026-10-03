import os
import statistics

from ai.second_detector import predict_second
from ai.sdxl_detector import predict_sdxl
from ai.fourth_detector import predict_fourth
from ai.video_ensemble import combine_visual_scores


IMAGE_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
)


def _extract_fake_probability(predictions):
    """
    Convert detector output into a fake probability in percentage.

    Supports list-based outputs such as:
        [
            {"label": "real", "confidence": 20.0},
            {"label": "fake", "confidence": 80.0}
        ]

    Also supports dictionary outputs containing
    fake_probability / raw_predictions.
    """

    if predictions is None:
        return 0.0

    # ----------------------------------------------------------
    # DICTIONARY OUTPUT
    # ----------------------------------------------------------

    if isinstance(predictions, dict):

        if "fake_probability" in predictions:
            return float(
                predictions["fake_probability"]
            )

        if "raw_predictions" in predictions:
            predictions = predictions[
                "raw_predictions"
            ]
        else:
            return 0.0

    # ----------------------------------------------------------
    # LIST OUTPUT
    # ----------------------------------------------------------

    if isinstance(predictions, list):

        fake = 0.0
        real = 0.0

        for item in predictions:

            if not isinstance(item, dict):
                continue

            label = str(
                item.get("label", "")
            ).lower().strip()

            confidence = item.get(
                "confidence",
                item.get("score", 0)
            )

            try:
                confidence = float(
                    confidence
                )
            except (
                TypeError,
                ValueError
            ):
                continue

            # Some models return 0-1 scores
            if 0 <= confidence <= 1:
                confidence *= 100

            # --------------------------------------------------
            # FAKE / AI CLASSES
            # --------------------------------------------------

            if any(
                keyword in label
                for keyword in (
                    "ai-generated",
                    "ai generated",
                    "ai_generated",
                    "artificial",
                    "fake",
                    "deepfake",
                    "synthetic",
                )
            ):
                fake = max(
                    fake,
                    confidence
                )

            # --------------------------------------------------
            # REAL CLASSES
            # --------------------------------------------------

            elif any(
                keyword in label
                for keyword in (
                    "human",
                    "real",
                    "authentic",
                    "natural",
                )
            ):
                real = max(
                    real,
                    confidence
                )

        if fake > 0:
            return fake

        if real > 0:
            return 100.0 - real

    return 0.0


def _analyze_frame(frame_path):
    """
    Analyze one video frame.

    IMPORTANT:
    Model 1 is intentionally NOT used here.

    Video models:
        Model 2
        Model 3 - SDXL
        Model 4 - Deepfake ViT
    """

    # ==========================================================
    # MODEL 2
    # ==========================================================

    model2 = predict_second(
        frame_path
    )

    model2_fake = _extract_fake_probability(
        model2
    )

    # ==========================================================
    # MODEL 3 - SDXL
    # ==========================================================

    model3 = predict_sdxl(
        frame_path
    )

    model3_fake = _extract_fake_probability(
        model3
    )

    # ==========================================================
    # MODEL 4 - DEEPFAKE ViT
    # ==========================================================

    model4 = predict_fourth(
        frame_path
    )

    model4_fake = (
        _extract_fake_probability(model4)
        if model4 is not None
        else None
    )

    # ==========================================================
    # VIDEO ENSEMBLE
    #
    # Model 3 receives the highest weight.
    # ==========================================================

    ensemble = combine_visual_scores(
        model2_fake,
        model3_fake,
        model4_fake,
    )

    frame_fake = ensemble["fake_probability"]

    return {
        "model_2_fake": round(
            model2_fake,
            2
        ),

        "model_3_fake": round(
            model3_fake,
            2
        ),

        "model_4_fake": (
            round(model4_fake, 2)
            if model4_fake is not None
            else None
        ),

        "model_4_weight": round(
            ensemble["model4_weight"],
            3,
        ),

        "model_4_consensus_gap": (
            round(ensemble["model4_consensus_gap"], 2)
            if ensemble["model4_consensus_gap"] is not None
            else None
        ),

        "model_4_status": ensemble["model4_status"],

        "frame_fake_probability": round(
            frame_fake,
            2
        ),
    }


def detect_video(frame_folder):
    """
    Analyze sampled video frames using
    Models 2, 3 and 4 only.

    Model 1 is reserved for standalone
    image analysis and is NOT used here.
    """

    # ==========================================================
    # FIND FRAMES
    # ==========================================================

    frames = sorted(
        [
            os.path.join(
                frame_folder,
                filename
            )
            for filename in os.listdir(
                frame_folder
            )
            if filename.lower().endswith(
                IMAGE_EXTENSIONS
            )
        ]
    )

    if not frames:
        raise ValueError(
            f"No frames found in: {frame_folder}"
        )

    # ==========================================================
    # SAMPLE MAXIMUM 20 FRAMES
    # ==========================================================

    if len(frames) > 20:

        step = len(frames) / 20

        selected_frames = []

        for index in range(20):

            frame_index = int(
                index * step
            )

            selected_frames.append(
                frames[frame_index]
            )

        frames = selected_frames

    # ==========================================================
    # ANALYZE FRAMES
    # ==========================================================

    frame_results = []

    for frame in frames:

        try:

            result = _analyze_frame(
                frame
            )

            frame_results.append(
                result
            )

        except Exception as exc:

            print(
                f"Frame analysis failed: "
                f"{frame} -> {exc}"
            )

    if not frame_results:
        raise ValueError(
            "All video frame analyses failed."
        )

    # ==========================================================
    # FRAME ENSEMBLE SCORES
    # ==========================================================

    fake_scores = [
        item["frame_fake_probability"]
        for item in frame_results
    ]

    # ==========================================================
    # MODEL AVERAGES
    # ==========================================================

    model2_scores = [
        item["model_2_fake"]
        for item in frame_results
    ]

    model3_scores = [
        item["model_3_fake"]
        for item in frame_results
    ]

    model4_scores = [
        item["model_4_fake"]
        for item in frame_results
        if item["model_4_fake"] is not None
    ]

    model4_used_frames = sum(
        item["model_4_weight"] > 0
        for item in frame_results
    )

    model4_outlier_frames = sum(
        item["model_4_status"] == "excluded_outlier"
        for item in frame_results
    )

    avg_model2 = statistics.mean(
        model2_scores
    )

    avg_model3 = statistics.mean(
        model3_scores
    )

    avg_model4 = (
        statistics.mean(
            model4_scores
        )
        if model4_scores
        else None
    )

    # ==========================================================
    # TEMPORAL AGGREGATION
    # ==========================================================

    mean_fake = statistics.mean(
        fake_scores
    )

    median_fake = statistics.median(
        fake_scores
    )

    video_fake = (
        median_fake * 0.70
        + mean_fake * 0.30
    )

    video_real = (
        100.0 - video_fake
    )

    # ==========================================================
    # FAKE FRAME RATIO
    # ==========================================================

    fake_frames = sum(
        1
        for score in fake_scores
        if score >= 50
    )

    fake_frame_ratio = (
        fake_frames /
        len(fake_scores)
    ) * 100

    # ==========================================================
    # FINAL RESULT
    # ==========================================================

    return {

        "face_score": round(
            video_real,
            2
        ),

        "fake_probability": round(
            video_fake,
            2
        ),

        "real_probability": round(
            video_real,
            2
        ),

        "frames_analyzed": len(
            frame_results
        ),

        "fake_frames": fake_frames,

        "fake_frame_ratio": round(
            fake_frame_ratio,
            2
        ),

        "model_scores": {

            "model_2_fake_probability":
                round(
                    avg_model2,
                    2
                ),

            "model_3_fake_probability":
                round(
                    avg_model3,
                    2
                ),

            "model_4_fake_probability": (
                round(
                    avg_model4,
                    2
                )
                if avg_model4 is not None
                else None
            ),

            "model_4_used_frames": model4_used_frames,

            "model_4_outlier_frames": model4_outlier_frames,
        },

        "aggregation": {

            "mean_fake_probability":
                round(
                    mean_fake,
                    2
                ),

            "median_fake_probability":
                round(
                    median_fake,
                    2
                ),
        },

        "model":
            "DeepVerify Video Ensemble",
    }
