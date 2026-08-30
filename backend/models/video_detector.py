import os
import statistics

from ai.inference import predict
from ai.second_detector import predict_second
from ai.sdxl_detector import predict_sdxl
from ai.fourth_detector import predict_fourth


IMAGE_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
)


def _extract_fake_probability(predictions):
    """
    Convert different model output formats into one fake probability.

    Supported:
    - Model 1 -> dictionary
    - Model 2 -> list of dictionaries
    - Model 3 -> list of dictionaries
    """

    # ==========================================================
    # MODEL 1 - DICTIONARY
    # ==========================================================

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

    # ==========================================================
    # LIST-BASED MODELS
    # ==========================================================

    if isinstance(predictions, list):

        fake = 0.0
        real = 0.0

        for item in predictions:

            if not isinstance(item, dict):
                continue

            label = str(
                item.get("label", "")
            ).lower().strip()

            confidence = float(
                item.get("confidence", 0)
            )

            # AI / fake classes
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

            # Real / human classes
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

        # If model explicitly gave fake probability
        if fake > 0:
            return fake

        # If only real was detected
        if real > 0:
            return 100.0 - real

    return 0.0


def _analyze_frame(frame_path):
    """
    Run all available image detectors on one video frame.
    """

    # ==========================================================
    # MODEL 1
    # ==========================================================

    model1 = predict(frame_path)

    model1_fake = _extract_fake_probability(
        model1
    )

    # ==========================================================
    # MODEL 2
    # ==========================================================

    model2 = predict_second(frame_path)

    model2_fake = _extract_fake_probability(
        model2
    )

    # ==========================================================
    # MODEL 3 - SDXL
    # ==========================================================

    model3 = predict_sdxl(frame_path)

    model3_fake = _extract_fake_probability(
        model3
    )

    # ==========================================================
    # MODEL 4 - Deepfake-vs-real ViT
    # ==========================================================

    model4 = predict_fourth(frame_path)
    model4_fake = (
        _extract_fake_probability(model4)
        if model4 is not None
        else None
    )

    # ==========================================================
    # VIDEO FRAME ENSEMBLE
    #
    # Model 3 is given the highest weight because it showed
    # the strongest separation in our benchmark.
    # ==========================================================

    weighted_scores = [
        (model1_fake, 0.20),
        (model2_fake, 0.15),
        (model3_fake, 0.45),
    ]
    if model4_fake is not None:
        weighted_scores.append((model4_fake, 0.20))

    total_weight = sum(weight for _, weight in weighted_scores)
    frame_fake = sum(score * weight for score, weight in weighted_scores) / total_weight

    return {

        "model_1_fake": round(
            model1_fake,
            2
        ),

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

        "frame_fake_probability": round(
            frame_fake,
            2
        ),
    }


def detect_video(frame_folder):

    """
    Analyze sampled video frames using four independent
    image detection models.

    The result is aggregated across frames to obtain
    a temporal video-level prediction.
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
    # LIMIT TO 20 FRAMES
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
    # COLLECT FRAME SCORES
    # ==========================================================

    fake_scores = [
        item["frame_fake_probability"]
        for item in frame_results
    ]

    model1_scores = [
        item["model_1_fake"]
        for item in frame_results
    ]

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

    # ==========================================================
    # TEMPORAL AGGREGATION
    #
    # Median protects against unusual individual frames.
    # Mean captures the overall video behaviour.
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

    video_real = 100.0 - video_fake

    # ==========================================================
    # FRAME-LEVEL FAKE RATIO
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
    # MODEL AVERAGES
    # ==========================================================

    avg_model1 = statistics.mean(
        model1_scores
    )

    avg_model2 = statistics.mean(
        model2_scores
    )

    avg_model3 = statistics.mean(
        model3_scores
    )

    avg_model4 = (
        statistics.mean(model4_scores)
        if model4_scores
        else None
    )

    # ==========================================================
    # RESULT
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

            "model_1_fake_probability":
                round(
                    avg_model1,
                    2
                ),

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
                round(avg_model4, 2)
                if avg_model4 is not None
                else None
            ),
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
